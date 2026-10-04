'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TopNavBar } from '../components/TopNavBar';
import { VIPRosterRail } from '../components/VIPRosterRail';
import { VIPAgentConsole } from '../components/VIPAgentConsole';
import { RichCardsContainer } from '../components/RichCardsContainer';
import { SideBySideComparisonView } from '../components/SideBySideComparisonView';
import { AmbientGlow, GlowState } from '../components/AmbientGlow';
import { mcpClient } from '../services/mcpClient';
import { pdfService } from '../services/pdfService';
import type {
  BudgetTier,
  DossierComparisonResponse,
  ExecutionMode,
  ExecutiveDossier,
  VIPProfile,
} from '../types';

export default function Home() {
  const [profiles, setProfiles] = useState<VIPProfile[]>([]);
  const [selectedVip, setSelectedVip] = useState<VIPProfile | null>(null);
  const [activeDossier, setActiveDossier] = useState<ExecutiveDossier | null>(null);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('executive_500');
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('qloo_grounded');
  const [isLoading, setIsLoading] = useState(false);
  const [glowState, setGlowState] = useState<GlowState>('idle');
  const [qlooLiveStatus, setQlooLiveStatus] = useState(false);

  // Side-by-side benchmark modal
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<DossierComparisonResponse | null>(null);

  const fetchDossier = useCallback(
    async (
      vipId: string,
      tier: BudgetTier = budgetTier,
      mode: ExecutionMode = executionMode,
      brief?: string
    ) => {
      setIsLoading(true);
      setGlowState('reasoning');

      try {
        const response = await mcpClient.generateDossier({
          vipId,
          budgetTier: tier,
          mode,
          meetingBrief: brief,
        });

        setActiveDossier(response.dossier);
        setGlowState('complete');
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
    setSelectedVip(vip);
    fetchDossier(vip.id, budgetTier, executionMode);
  };

  const handleToggleMode = (newMode: ExecutionMode) => {
    setExecutionMode(newMode);
    if (selectedVip) {
      fetchDossier(selectedVip.id, budgetTier, newMode);
    }
  };

  const handleSelectTier = (tier: BudgetTier) => {
    setBudgetTier(tier);
    if (selectedVip) {
      fetchDossier(selectedVip.id, tier, executionMode);
    }
  };

  const handleGenerateFromConsole = async (brief: string) => {
    if (!selectedVip) return;
    await fetchDossier(selectedVip.id, budgetTier, executionMode, brief);
  };

  const handleOpenSideBySide = async () => {
    if (!selectedVip) return;
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
    <div className="min-h-[100dvh] bg-[#070709] text-stone-100 flex flex-col relative pb-16">
      {/* Top Navigation Bar with Grounding Toggle */}
      <TopNavBar
        executionMode={executionMode}
        onToggleMode={handleToggleMode}
        onOpenSideBySide={handleOpenSideBySide}
        onExportPdf={handleExportPdf}
        activeDossier={activeDossier}
        qlooLiveStatus={qlooLiveStatus}
      />

      {/* Main Workspace Layout */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar: VIP Principals Roster */}
        <VIPRosterRail
          profiles={profiles}
          selectedVipId={selectedVip?.id || null}
          onSelectVip={handleSelectVip}
        />

        {/* Center & Right Column: Agent Console & Rich Dossier Cards */}
        <div className="flex-1 min-w-0">
          {/* Executive Chief of Staff Console */}
          <VIPAgentConsole
            selectedVip={selectedVip}
            budgetTier={budgetTier}
            onSelectTier={handleSelectTier}
            executionMode={executionMode}
            onGenerateDossier={handleGenerateFromConsole}
            isLoading={isLoading}
            onVoiceStateChange={(listening) =>
              setGlowState(listening ? 'listening' : 'idle')
            }
          />

          {/* Rich Cards Container (Taste Graph, Gifts, Dining, Compliance) */}
          <RichCardsContainer dossier={activeDossier} />
        </div>
      </main>

      {/* Side-by-Side Competitive Benchmark Modal */}
      <SideBySideComparisonView
        comparison={comparisonData}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />

      {/* Bottom Ambient Glow Light Strip */}
      <AmbientGlow state={glowState} />
    </div>
  );
}