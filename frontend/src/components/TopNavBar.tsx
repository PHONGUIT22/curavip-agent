'use client';

import React, { useState } from 'react';
import { Compass, SplitSquareVertical, Download, Zap, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundService } from '../services/soundService';
import type { ExecutionMode, ExecutiveDossier } from '../types';

interface TopNavBarProps {
  executionMode: ExecutionMode;
  onToggleMode: (mode: ExecutionMode) => void;
  onOpenSideBySide: () => void;
  onOpenSynergy?: () => void;
  onExportPdf?: () => void;
  activeDossier: ExecutiveDossier | null;
  qlooLiveStatus?: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  executionMode,
  onToggleMode,
  onOpenSideBySide,
  onOpenSynergy,
  onExportPdf,
  activeDossier,
  qlooLiveStatus = false,
}) => {
  const isGrounded = executionMode === 'qloo_grounded';
  const [isMuted, setIsMuted] = useState(soundService.isMuted());

  return (
    <header className="w-full bg-[#F8F6F0] border-b border-[#E5E0D6] px-6 py-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Editorial Sub-Header Breadcrumb & Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B736D]">
              01 / Executive Concierge
            </span>
            <span className="text-[#C2C8C4] text-xs">·</span>
            <span className="text-xs font-medium text-[#183D33] uppercase tracking-wide">
              Family Office Terminal
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#161A18] tracking-tight">
            Autonomous Cultural Intelligence & VIP Concierge
          </h1>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Grounding Engine Segmented Toggle */}
          <div className="flex items-center p-1 rounded-lg border border-[#E5E0D6] bg-[#FAF8F5]">
            <button
              onClick={() => {
                soundService.playToggleClick();
                onToggleMode('qloo_grounded');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wide transition-all rounded-md ${
                isGrounded
                  ? 'bg-[#183D33] text-white font-semibold shadow-sm'
                  : 'text-[#6B736D] hover:text-[#161A18] font-medium'
              }`}
              title="Ground curation in Qloo Cultural Taste Graph"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Qloo Grounded</span>
            </button>

            <button
              onClick={() => {
                soundService.playToggleClick();
                onToggleMode('generic_llm');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wide transition-all rounded-md ${
                !isGrounded
                  ? 'bg-[#C53030] text-white font-semibold shadow-sm'
                  : 'text-[#6B736D] hover:text-[#161A18] font-medium'
              }`}
              title="Switch to ungrounded generic baseline LLM"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Generic LLM</span>
            </button>
          </div>

          {/* Benchmark Button */}
          <button
            onClick={() => {
              soundService.playMechanicalClick();
              onOpenSideBySide();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide border border-[#E5E0D6] bg-white text-[#161A18] hover:border-[#183D33] hover:text-[#183D33] transition-colors rounded-lg shadow-sm"
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-[#183D33]" />
            <span>Benchmark</span>
          </button>

          {/* Taste Synergy Matcher Button */}
          {onOpenSynergy && (
            <button
              onClick={() => {
                soundService.playMechanicalClick();
                onOpenSynergy();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide border border-[#2D7360]/30 bg-[#EDF4F0] text-[#183D33] hover:bg-[#183D33] hover:text-white transition-all rounded-lg shadow-sm"
              title="Diplomatic Collab & Taste Synergy Matcher"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2D7360]" />
              <span>Taste Synergy</span>
            </button>
          )}

          {/* Export PDF Button */}
          {activeDossier && (
            <button
              onClick={() => {
                soundService.playMechanicalClick();
                onExportPdf?.();
              }}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide bg-[#183D33] text-white hover:bg-[#224F43] transition-colors rounded-lg shadow-sm"
              title="Export 1-Page Archival PDF Summary"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger</span>
            </button>
          )}

          {/* Audio Feedback Mute Toggle */}
          <button
            type="button"
            onClick={() => {
              const muted = soundService.toggleMute();
              setIsMuted(muted);
            }}
            className={`p-2 border rounded-lg transition-colors shadow-2xs ${
              !isMuted
                ? 'border-[#C8DCD1] bg-[#EDF4F0] text-[#1D5A4A]'
                : 'border-[#E5E0D6] bg-white text-[#8C938E] hover:text-[#161A18]'
            }`}
            title={isMuted ? 'Muted: Bấm để bật âm thanh phản hồi haptic' : 'Bật âm: Bấm để tắt'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* System Provenance Stamp */}
          <div className="hidden xl:flex items-center gap-2 text-xs font-medium px-3 py-1 border border-[#C8DCD1] bg-[#EDF4F0] text-[#1D5A4A] rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>{qlooLiveStatus ? 'QLOO LIVE API' : 'QLOO TASTE GRAPH'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
