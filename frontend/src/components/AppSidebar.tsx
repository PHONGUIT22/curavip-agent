'use client';

import React from 'react';
import { Menu, SlidersHorizontal, Users, FileText, SplitSquareVertical } from 'lucide-react';

interface AppSidebarProps {
  onOpenBenchmark?: () => void;
  onNavigateConsole?: () => void;
  onNavigateRoster?: () => void;
  onNavigateDossier?: () => void;
  activeSection?: 'console' | 'roster' | 'dossier' | 'benchmark';
  qlooLiveStatus?: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  onOpenBenchmark,
  onNavigateConsole,
  onNavigateRoster,
  onNavigateDossier,
  activeSection = 'console',
  qlooLiveStatus = false,
}) => {
  return (
    <aside className="w-16 md:w-18 flex-shrink-0 bg-[#14342B] border-r border-[#183D33] flex flex-col items-center justify-between py-5 z-40 select-none">
      {/* Top Brand / Menu Bar */}
      <div className="flex flex-col items-center gap-6 w-full">
        <button
          type="button"
          onClick={onNavigateConsole}
          className="w-10 h-10 flex items-center justify-center text-[#DDEBE3] hover:text-white transition-colors"
          title="CuraVIP Navigation"
        >
          <Menu className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Core Navigation Icons */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {/* Executive Console */}
          <button
            type="button"
            onClick={onNavigateConsole}
            className={`w-10 h-10 flex items-center justify-center transition-all ${
              activeSection === 'console'
                ? 'bg-[#1D5A4A] border border-[#2D7360] text-white shadow-sm rounded-xl'
                : 'text-[#8BA89B] hover:text-[#DDEBE3] hover:bg-[#1A4237] rounded-lg transition-colors'
            }`}
            title="Executive Console"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* VIP Principals Roster */}
          <button
            type="button"
            onClick={onNavigateRoster}
            className={`w-10 h-10 flex items-center justify-center transition-all ${
              activeSection === 'roster'
                ? 'bg-[#1D5A4A] border border-[#2D7360] text-white shadow-sm rounded-xl'
                : 'text-[#8BA89B] hover:text-[#DDEBE3] hover:bg-[#1A4237] rounded-lg transition-colors'
            }`}
            title="VIP Principals Roster"
          >
            <Users className="w-4 h-4" />
          </button>

          {/* Taste Graph Ledger */}
          <button
            type="button"
            onClick={onNavigateDossier}
            className={`w-10 h-10 flex items-center justify-center transition-all ${
              activeSection === 'dossier'
                ? 'bg-[#1D5A4A] border border-[#2D7360] text-white shadow-sm rounded-xl'
                : 'text-[#8BA89B] hover:text-[#DDEBE3] hover:bg-[#1A4237] rounded-lg transition-colors'
            }`}
            title="Taste Graph & Dossier Ledger"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Benchmark Trigger */}
          <button
            type="button"
            onClick={onOpenBenchmark}
            className={`w-10 h-10 flex items-center justify-center transition-all ${
              activeSection === 'benchmark'
                ? 'bg-[#1D5A4A] border border-[#2D7360] text-white shadow-sm rounded-xl'
                : 'text-[#8BA89B] hover:text-[#DDEBE3] hover:bg-[#1A4237] rounded-lg transition-colors'
            }`}
            title="Side-by-Side Benchmark"
          >
            <SplitSquareVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Monogram & Status */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-9 h-9 rounded-xl bg-[#0E251F] border border-[#1E4D3E] flex items-center justify-center text-[#DDEBE3] font-semibold text-xs tracking-wider shadow-2xs">
          CV
        </div>
        <span className="text-[10px] tracking-widest text-[#8BA89B] uppercase font-semibold">
          {qlooLiveStatus ? 'LIVE' : 'LOCAL'}
        </span>
      </div>
    </aside>
  );
};
