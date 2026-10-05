'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavBar } from '../components/TopNavBar';
import { VIPRosterRail } from '../components/VIPRosterRail';
import { VIPAgentConsole } from '../components/VIPAgentConsole';
import { RichCardsContainer } from '../components/RichCardsContainer';
import { SideBySideComparisonView } from '../components/SideBySideComparisonView';
import { CreateVipModal } from '../components/CreateVipModal';
import { TasteSynergyModal } from '../components/TasteSynergyModal';
import { GuidedJudgeTour } from '../components/GuidedJudgeTour';
import { AmbientGlow, GlowState } from '../components/AmbientGlow';
import { mcpClient } from '../services/mcpClient';
import { pdfService } from '../services/pdfService';
import { soundService } from '../services/soundService';
import type {
  AgentTraceStep,
  BudgetTier,
  DossierComparisonResponse,
  ExecutionMode,
  ExecutiveDossier,
  VIPProfile,
  VIPProfileInput,
} from '../types';

export default function Home() {
  const [profiles, setProfiles] = useState<VIPProfile[]>([]);
  const [selectedVip, setSelectedVip] = useState<VIPProfile | null>(null);
  const [activeDossier, setActiveDossier] = useState<ExecutiveDossier | null>(null);
  const [activeTrace, setActiveTrace] = useState<AgentTraceStep[]>([]);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('executive_500');
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('qloo_grounded');
  const [isLoading, setIsLoading] = useState(false);
  const [glowState, setGlowState] = useState<GlowState>('idle');
  const [qlooLiveStatus, setQlooLiveStatus] = useState(false);

  // Side-by-side benchmark modal
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<DossierComparisonResponse | null>(null);
  const [activeSection, setActiveSection] = useState<'console' | 'roster' | 'dossier' | 'benchmark' | 'synergy'>('console');

  // Dual-VIP Taste Synergy matcher modal
  const [isSynergyOpen, setIsSynergyOpen] = useState(false);

  // Custom VIP Builder modal for hackathon judges
  const [isCreateVipOpen, setIsCreateVipOpen] = useState(false);

  const fetchDossier = useCallback(
    async (
      vipId: string,
      tier: BudgetTier = budgetTier,
      mode: ExecutionMode = executionMode,
      brief?: string
    ) => {
      setIsLoading(true);
      setGlowState('reasoning');
      setActiveTrace([]);

      try {
        const response = await mcpClient.generateDossierStream(
          {
            vipId,
            budgetTier: tier,
            mode,
            meetingBrief: brief,
          },
          (step) => {
            setActiveTrace((prev) => {
              const idx = prev.findIndex((s) => s.id === step.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = step;
                return next;
              }
              return [...prev, step];
            });
          }
        );

        setActiveDossier(response.dossier);
        if (response.trace) {
          setActiveTrace(response.trace);
        }
        setGlowState('complete');
        soundService.playSuccessChime();
        setTimeout(() => setGlowState('idle'), 1500);
      } catch (err) {
        console.error('Failed to generate dossier:', err);
        setGlowState('error');
        setTimeout(() => setGlowState('idle'), 2000);
      } finally {
        setIsLoading(false);
      }
    },
    [budgetTier, executionMode]
  );

  // Load VIP roster on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const health = await mcpClient.getHealth();
        setQlooLiveStatus(health.qlooConfigured);

        const vips = await mcpClient.listVIPs();
        if (vips.length > 0) {
          setProfiles(vips);
          setSelectedVip(vips[0]);
          // Automatically compose initial dossier for the lead principal (Marcus Vance)
          fetchDossier(vips[0].id, 'executive_500', 'qloo_grounded');
        }
      } catch (err) {
        console.warn('Initialization error:', err);
      }
    }
    loadInitialData();
  }, [fetchDossier]);

  const handleSelectVip = (vip: VIPProfile) => {
    soundService.playMechanicalClick();
    setSelectedVip(vip);
    fetchDossier(vip.id, budgetTier, executionMode);
  };

  const handleToggleMode = (newMode: ExecutionMode) => {
    soundService.playToggleClick();
    setExecutionMode(newMode);
    if (selectedVip) {
      fetchDossier(selectedVip.id, budgetTier, newMode);
    }
  };

  const handleSelectTier = (tier: BudgetTier) => {
    soundService.playMechanicalClick();
    setBudgetTier(tier);
    if (selectedVip) {
      fetchDossier(selectedVip.id, tier, executionMode);
    }
  };

  const scrollToSection = (id: string, section?: 'console' | 'roster' | 'dossier' | 'benchmark') => {
    if (section) {
      setActiveSection(section);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGenerateFromConsole = async (
    brief: string,
    overrideVipId?: string,
    overrideTier?: BudgetTier
  ) => {
    const targetVipId = overrideVipId || selectedVip?.id;
    if (!targetVipId) return;
    const targetTier = overrideTier || budgetTier;
    await fetchDossier(targetVipId, targetTier, executionMode, brief);
    // Auto-scroll down to results section
    setTimeout(() => {
      scrollToSection('dossier-results', 'dossier');
    }, 200);
  };

  const handleCreateVip = async (newProfileInput: VIPProfileInput) => {
    try {
      setIsLoading(true);
      setGlowState('reasoning');
      const saved = await mcpClient.upsertVIP(newProfileInput);
      setProfiles((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
      setSelectedVip(saved);
      // Immediately trigger dynamic dossier synthesis for the new principal
      await fetchDossier(saved.id, budgetTier, executionMode);
    } catch (err) {
      console.error('Failed to create custom VIP:', err);
      setGlowState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSideBySide = async () => {
    if (!selectedVip) return;
    setActiveSection('benchmark');
    setIsLoading(true);
    setGlowState('reasoning');

    try {
      const comparison = await mcpClient.compareDossiers(selectedVip.id, budgetTier);
      setComparisonData(comparison);
      setIsComparisonOpen(true);
      setGlowState('complete');
      setTimeout(() => setGlowState('idle'), 1000);
    } catch (err) {
      console.error('Failed to run comparison:', err);
      setGlowState('error');
      setTimeout(() => setGlowState('idle'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (activeDossier) {
      pdfService.exportExecutiveDossierPdf(activeDossier);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8F6F0] text-[#161A18] flex flex-row relative selection:bg-[#183D33]/15 selection:text-[#183D33]">
      {/* Left Deep Pine Sidebar */}
      <AppSidebar
        onOpenBenchmark={handleOpenSideBySide}
        onOpenSynergy={() => {
          setIsSynergyOpen(true);
          setActiveSection('synergy');
        }}
        onNavigateConsole={() => scrollToSection('console-section', 'console')}
        onNavigateRoster={() => scrollToSection('roster-section', 'roster')}
        onNavigateDossier={() => scrollToSection('dossier-results', 'dossier')}
        activeSection={activeSection}
        qlooLiveStatus={qlooLiveStatus}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16">
        {/* Top Navigation Bar with Grounding Toggle */}
        <TopNavBar
          executionMode={executionMode}
          onToggleMode={handleToggleMode}
          onOpenSideBySide={handleOpenSideBySide}
          onOpenSynergy={() => {
            setIsSynergyOpen(true);
            setActiveSection('synergy');
          }}
          onExportPdf={handleExportPdf}
          activeDossier={activeDossier}
          qlooLiveStatus={qlooLiveStatus}
        />

        {/* Main Workspace Layout */}
        <main className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar: VIP Principals Roster */}
          <div id="roster-section" className="w-full lg:w-80 flex-shrink-0 scroll-mt-6">
            <VIPRosterRail
              profiles={profiles}
              selectedVipId={selectedVip?.id || null}
              onSelectVip={handleSelectVip}
              onOpenCreateVip={() => setIsCreateVipOpen(true)}
            />
          </div>

          {/* Center & Right Column: Agent Console & Rich Dossier Cards */}
          <div className="flex-1 min-w-0">
            {/* Executive Chief of Staff Console */}
            <div id="console-section" className="scroll-mt-6">
              <VIPAgentConsole
                selectedVip={selectedVip}
                budgetTier={budgetTier}
                onSelectTier={handleSelectTier}
                executionMode={executionMode}
                onGenerateDossier={handleGenerateFromConsole}
                isLoading={isLoading}
                activeDossier={activeDossier}
                profiles={profiles}
                onSelectVip={handleSelectVip}
                onDossierUpdated={(newDossier) => {
                  setActiveDossier(newDossier);
                  setTimeout(() => {
                    scrollToSection('dossier-results', 'dossier');
                  }, 150);
                }}
                onVoiceStateChange={(listening) =>
                  setGlowState(listening ? 'listening' : 'idle')
                }
                traceSteps={activeTrace}
                onAddTraceStep={(step) => setActiveTrace((prev) => [step, ...prev])}
              />
            </div>

            {/* Rich Cards Container (Taste Graph, Gifts, Dining, Compliance) */}
            <div id="dossier-results" className="scroll-mt-6">
              <RichCardsContainer dossier={activeDossier} isLoading={isLoading} />
            </div>
          </div>
        </main>
      </div>

      {/* Side-by-Side Competitive Benchmark Modal */}
      <SideBySideComparisonView
        comparison={comparisonData}
        isOpen={isComparisonOpen}
        onClose={() => {
          setIsComparisonOpen(false);
          setActiveSection('console');
        }}
      />

      {/* Custom VIP Builder Modal for Hackathon Judges */}
      <CreateVipModal
        isOpen={isCreateVipOpen}
        onClose={() => setIsCreateVipOpen(false)}
        onSubmit={handleCreateVip}
        isLoading={isLoading}
      />

      {/* Dual-VIP Taste Synergy & Diplomatic Collab Modal */}
      <TasteSynergyModal
        isOpen={isSynergyOpen}
        onClose={() => {
          setIsSynergyOpen(false);
          setActiveSection('console');
        }}
        profiles={profiles}
        initialVipId={selectedVip?.id}
      />

      {/* 60-Second Guided Tour for Hackathon Judges */}
      <GuidedJudgeTour
        onNavigateSection={(id) => scrollToSection(id)}
        onOpenBenchmark={handleOpenSideBySide}
        onOpenSynergy={() => {
          setIsSynergyOpen(true);
          setActiveSection('synergy');
        }}
        onExportPdf={handleExportPdf}
      />

      {/* Bottom Ambient Glow Light Strip */}
      <AmbientGlow state={glowState} />
    </div>
  );
}