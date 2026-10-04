'use client';

import React from 'react';
import { Compass, SplitSquareVertical, Download, Zap } from 'lucide-react';
import type { ExecutionMode, ExecutiveDossier } from '../types';

interface TopNavBarProps {
  executionMode: ExecutionMode;
  onToggleMode: (mode: ExecutionMode) => void;
  onOpenSideBySide: () => void;
  onExportPdf?: () => void;
  activeDossier: ExecutiveDossier | null;
  qlooLiveStatus?: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  executionMode,
  onToggleMode,
  onOpenSideBySide,
  onExportPdf,
  activeDossier,
  qlooLiveStatus = false,
}) => {
  const isGrounded = executionMode === 'qloo_grounded';

  return (
    <header className="w-full bg-[#F8F6F0] border-b border-[#E5E0D6] px-6 py-4.5">
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
              onClick={() => onToggleMode('qloo_grounded')}
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
              onClick={() => onToggleMode('generic_llm')}
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
            onClick={onOpenSideBySide}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide border border-[#E5E0D6] bg-white text-[#161A18] hover:border-[#183D33] hover:text-[#183D33] transition-colors rounded-lg shadow-sm"
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-[#183D33]" />
            <span>Benchmark</span>
          </button>

          {/* Export PDF Button */}
          {activeDossier && (
            <button
              onClick={onExportPdf}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide bg-[#183D33] text-white hover:bg-[#224F43] transition-colors rounded-lg shadow-sm"
              title="Export 1-Page Archival PDF Summary"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger</span>
            </button>
          )}

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
