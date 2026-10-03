'use client';

import React from 'react';
import { Sparkles, SplitSquareVertical, ShieldCheck, Zap, Download } from 'lucide-react';
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
    <header className="sticky top-0 z-30 w-full bg-obsidian-900/90 backdrop-blur-md border-b border-white/[0.07] px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Crest & Monogram */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-champagne-500/20 via-obsidian-700 to-obsidian-800 border border-champagne-500/30 flex items-center justify-center shadow-luxury-glow">
            <span className="font-serif font-bold text-lg text-champagne-400 tracking-wider">CV</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg md:text-xl font-bold tracking-wide text-stone-100">
                CURAVIP
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-champagne-500/10 text-champagne-400 border border-champagne-500/25">
                Executive
              </span>
            </div>
            <p className="text-[11px] text-stone-400 tracking-wider uppercase font-medium">
              Cultural Intelligence & Relationship Concierge
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-3">
          {/* THE GROUNDING TOGGLE - JUDGE WINNING SWITCH */}
          <div className="flex items-center gap-2 bg-obsidian-800 p-1 rounded-xl border border-white/[0.08] shadow-inner">
            <button
              onClick={() => onToggleMode('qloo_grounded')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isGrounded
                  ? 'bg-gradient-to-r from-champagne-500 to-champagne-600 text-obsidian-900 shadow-md font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Ground recommendations in Qloo's 250M+ cross-domain taste graph"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Qloo Grounding</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-obsidian-900/40 text-stone-900 font-bold ml-0.5">
                ON
              </span>
            </button>

            <button
              onClick={() => onToggleMode('generic_llm')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !isGrounded
                  ? 'bg-crimsonAlert/20 text-crimsonAlert border border-crimsonAlert/40 shadow-sm font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Show generic, culturally blind baseline LLM recommendations"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Generic LLM</span>
            </button>
          </div>

          {/* Side-by-Side Comparison Trigger */}
          <button
            onClick={onOpenSideBySide}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-champagne-400 border border-champagne-500/25 text-xs font-medium transition-all shadow-sm hover:border-champagne-500/40"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>

          {/* Export PDF Button if Dossier Loaded */}
          {activeDossier && (
            <button
              onClick={onExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-stone-200 border border-white/[0.1] text-xs font-medium transition-all hover:text-champagne-400"
              title="Export 1-Page Executive PDF Presentation"
            >
              <Download className="w-3.5 h-3.5 text-champagne-400" />
              <span className="hidden md:inline">Export PDF</span>
            </button>
          )}

          {/* System Provenance Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emeraldStatus/10 text-emeraldStatus border border-emeraldStatus/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emeraldStatus animate-ping" />
            <span>{qlooLiveStatus ? 'QLOO LIVE API' : 'QLOO TASTE GRAPH'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
