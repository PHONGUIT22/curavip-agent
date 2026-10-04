'use client';

import React from 'react';
import { Sparkles, SplitSquareVertical, Download, Zap } from 'lucide-react';
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
    <header className="sticky top-0 z-30 w-full h-14 bg-[#070709] border-b border-stone-800 px-4 md:px-6 flex items-center">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none border border-champagne-500/40 bg-[#0B0B10] flex items-center justify-center">
            <span className="font-serif font-bold text-sm text-champagne-400">CV</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-base font-bold tracking-widest text-stone-100">
              CURAVIP
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono text-stone-500 tracking-wider uppercase">
              / Family Office Concierge
            </span>
          </div>
        </div>

        {/* Center / Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Grounding Toggle */}
          <div className="flex items-center border border-stone-800 bg-[#0B0B10]">
            <button
              onClick={() => onToggleMode('qloo_grounded')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                isGrounded
                  ? 'bg-champagne-500 text-[#070709] font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Ground curation in Qloo Cultural Taste Graph"
            >
              <Sparkles className="w-3 h-3" />
              <span>Qloo Grounded</span>
            </button>

            <button
              onClick={() => onToggleMode('generic_llm')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider transition-colors border-l border-stone-800 ${
                !isGrounded
                  ? 'bg-crimsonAlert/20 text-crimsonAlert font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Switch to ungrounded generic baseline LLM"
            >
              <Zap className="w-3 h-3" />
              <span>Generic LLM</span>
            </button>
          </div>

          {/* Side-by-Side Comparison Trigger */}
          <button
            onClick={onOpenSideBySide}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider border border-stone-800 bg-[#0B0B10] text-stone-300 hover:border-champagne-500/50 hover:text-champagne-400 transition-colors"
          >
            <SplitSquareVertical className="w-3 h-3 text-champagne-400" />
            <span className="hidden sm:inline">Benchmark</span>
          </button>

          {/* Export PDF Button if Active Dossier Exists */}
          {activeDossier && (
            <button
              onClick={onExportPdf}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider border border-stone-800 bg-[#0B0B10] text-stone-300 hover:border-champagne-500/50 hover:text-champagne-400 transition-colors"
              title="Export 1-Page Archival PDF Summary"
            >
              <Download className="w-3 h-3 text-champagne-400" />
              <span className="hidden md:inline">PDF</span>
            </button>
          )}

          {/* System Provenance Stamp */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 border border-stone-800 bg-[#0B0B10] text-stone-400">
            <span className="w-1.5 h-1.5 rounded-none bg-emeraldStatus" />
            <span>{qlooLiveStatus ? 'QLOO LIVE API' : 'QLOO TASTE GRAPH'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
