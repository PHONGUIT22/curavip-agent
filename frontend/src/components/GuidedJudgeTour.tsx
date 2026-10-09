'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  CheckCircle2,
  Users,
  Layers,
  Calendar,
  SplitSquareVertical,
  Download,
} from 'lucide-react';
import { soundService } from '../services/soundService';

interface GuidedJudgeTourProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenBenchmark?: () => void;
  onOpenSynergy?: () => void;
  onExportPdf?: () => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    badge: 'Step 1 of 4 · Executive Principals',
    title: 'Select a VIP Principal & Inspect Hard Taboos',
    description:
      'Choose between Marcus Vance (Brutalism & Nolan), Tariq Al-Mansoor (Horology & Strict Halal), or Elena Rostova (Natural Wine & Fashion). Or click "+ New Principal" to test custom taste profiles.',
    targetId: 'roster-section',
    actionText: 'Scroll to Principals Roster',
  },
  {
    step: 2,
    badge: 'Step 2 of 4 · Cultural Intelligence',
    title: 'Inspect Qloo Taste Graph & "Why This?" Badges',
    description:
      'Look at the Taste Dossier below. Every gift and restaurant recommendation features a "Qloo Affinity 94%" badge. Click or hover on it to reveal real cross-domain cultural data grounding each proposal.',
    targetId: 'dossier-results',
    actionText: 'Inspect Taste Graph & Cards',
  },
  {
    step: 3,
    badge: 'Step 3 of 4 · Advanced Multi-Vector Engines',
    title: 'Dual-VIP Synergy & Competitive Grounding Benchmark',
    description:
      'Click "Taste Synergy" to find cultural intersection for bilateral meetings between two VIPs, or "Benchmark" to compare Qloo-grounded curation against an ungrounded Generic LLM baseline.',
    targetId: 'console-section',
    actionText: 'Open Taste Synergy Engine',
  },
  {
    step: 4,
    badge: 'Step 4 of 4 · Autonomous Action Execution',
    title: '1-Click Concierge Booking, .ICS & Archival PDF',
    description:
      'CuraVIP does not just talk—it executes. Click "Book Table" on any dining card, download a real RFC-5545 .ICS calendar invite, or export the 1-Page Executive PDF Ledger.',
    targetId: 'dossier-results',
    actionText: 'Export Archival PDF',
  },
];

export const GuidedJudgeTour: React.FC<GuidedJudgeTourProps> = ({
  onNavigateSection,
  onOpenBenchmark,
  onOpenSynergy,
  onExportPdf,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = TOUR_STEPS[currentStepIndex];

  const highlightTargetSection = (targetId: string) => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(targetId);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const highlightClasses = [
      'ring-4',
      'ring-[#183D33]/40',
      'shadow-2xl',
      'transition-all',
      'duration-700',
    ];

    el.classList.add(...highlightClasses);

    setTimeout(() => {
      el.classList.remove(...highlightClasses);
    }, 3000);
  };

  const navigateToStep = (index: number) => {
    setCurrentStepIndex(index);
    const targetId = TOUR_STEPS[index].targetId;
    if (onNavigateSection) {
      onNavigateSection(targetId);
    }
    highlightTargetSection(targetId);
  };

  const handleStartTour = () => {
    soundService.playMechanicalClick();
    setIsOpen(true);
    navigateToStep(0);
  };

  const handleNext = () => {
    soundService.playMechanicalClick();
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      navigateToStep(currentStepIndex + 1);
    } else {
      soundService.playSuccessChime();
      setIsOpen(false);
    }
  };

  const handlePrev = () => {
    soundService.playMechanicalClick();
    if (currentStepIndex > 0) {
      navigateToStep(currentStepIndex - 1);
    }
  };

  const handleExecuteStepAction = () => {
    soundService.playMechanicalClick();
    if (currentStepIndex === 0) {
      onNavigateSection?.('roster-section');
      highlightTargetSection('roster-section');
    } else if (currentStepIndex === 1) {
      onNavigateSection?.('dossier-results');
      highlightTargetSection('dossier-results');
    } else if (currentStepIndex === 2) {
      if (onOpenSynergy) {
        onOpenSynergy();
      } else {
        onNavigateSection?.('console-section');
        highlightTargetSection('console-section');
      }
    } else if (currentStepIndex === 3) {
      if (onExportPdf) {
        onExportPdf();
      } else {
        onNavigateSection?.('dossier-results');
        highlightTargetSection('dossier-results');
      }
    }
  };

  return (
    <>
      {/* Floating Trigger Button for Hackathon Judges */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleStartTour}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-[#14342B] text-white border border-[#2D7360] shadow-xl hover:bg-[#1D5A4A] hover:shadow-2xl transition-all group scale-100 hover:scale-105"
          title="Launch 60-Second Guided Tour for Hackathon Judges"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E5D0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
          </span>
          <Sparkles className="w-4 h-4 text-[#A3E5D0] group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            60-Second Judge Tour
          </span>
        </button>
      )}

      {/* Floating Interactive Guide Card */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] bg-white border border-[#183D33]/25 rounded-3xl shadow-2xl overflow-hidden animate-fade-in flex flex-col">
          {/* Card Top Banner */}
          <div className="bg-[#14342B] px-5 py-3.5 text-white flex items-center justify-between border-b border-[#2D7360]/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A3E5D0]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#DDEBE3]">
                {currentStep.badge}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                soundService.playMechanicalClick();
                setIsOpen(false);
              }}
              className="text-[#8BA89B] hover:text-white transition-colors"
              title="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Top Smooth Progress Track (4 Steps) */}
          <div className="w-full bg-[#0F2822] h-1.5 flex gap-1 px-2 py-0.5">
            {TOUR_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                  idx <= currentStepIndex
                    ? 'bg-[#A3E5D0] shadow-[0_0_8px_rgba(163,229,208,0.7)]'
                    : 'bg-[#2D7360]/40'
                }`}
              />
            ))}
          </div>

          {/* Card Content */}
          <div className="p-5 space-y-3.5 bg-gradient-to-b from-white to-[#FAF8F5]">
            {/* Step Progress Indicators */}
            <div className="grid grid-cols-4 gap-1.5 pb-1">
              {TOUR_STEPS.map((step, idx) => (
                <div
                  key={step.step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStepIndex
                      ? 'bg-[#183D33]'
                      : idx < currentStepIndex
                      ? 'bg-[#2D7360]'
                      : 'bg-[#E5E0D6]'
                  }`}
                />
              ))}
            </div>

            <h3 className="font-serif text-lg font-bold text-[#161A18] leading-snug">
              {currentStep.title}
            </h3>

            <p className="text-xs text-[#4A524D] leading-relaxed">
              {currentStep.description}
            </p>

            {/* Contextual Action Button */}
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExecuteStepAction}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D5CEC2] text-xs font-semibold text-[#183D33] hover:bg-[#EDE8DE] transition-colors active:scale-95 shadow-2xs"
              >
                {currentStepIndex === 2 ? (
                  <Users className="w-3.5 h-3.5 text-[#183D33]" />
                ) : currentStepIndex === 3 ? (
                  <Download className="w-3.5 h-3.5 text-[#183D33]" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-[#183D33]" />
                )}
                <span>{currentStep.actionText}</span>
              </button>

              {currentStepIndex === 2 && onOpenBenchmark && (
                <button
                  type="button"
                  onClick={() => {
                    soundService.playMechanicalClick();
                    onOpenBenchmark();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D5CEC2] text-xs font-semibold text-[#183D33] hover:bg-[#EDE8DE] transition-colors active:scale-95 shadow-2xs"
                >
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  <span>Open Benchmark</span>
                </button>
              )}

              {currentStepIndex === 3 && (
                <button
                  type="button"
                  onClick={() => {
                    soundService.playMechanicalClick();
                    onNavigateSection?.('dossier-results');
                    highlightTargetSection('dossier-results');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D5CEC2] text-xs font-semibold text-[#183D33] hover:bg-[#EDE8DE] transition-colors active:scale-95 shadow-2xs"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#183D33]" />
                  <span>Scroll to Dossier Cards</span>
                </button>
              )}
            </div>
          </div>

          {/* Stepper Navigation Footer */}
          <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#EBE6DD] flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                currentStepIndex === 0
                  ? 'text-[#B2BDB6] cursor-not-allowed'
                  : 'text-[#183D33] hover:text-[#112B24]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <span className="text-2xs font-semibold text-[#8BA89B] tracking-wider uppercase">
              {currentStepIndex + 1} / {TOUR_STEPS.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#183D33] hover:bg-[#224F43] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
