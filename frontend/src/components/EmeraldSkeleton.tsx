'use client';

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export const EmeraldSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-slide">
      {/* Top Reasoning Indicator */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-[#C8DCD1] bg-[#EDF4F0]/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1D5A4A] flex items-center justify-center text-white shadow-xs">
            <Compass className="w-4 h-4 animate-spin text-white" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#183D33] flex items-center gap-2">
              <span>Synthesizing Cultural Taste Graph</span>
              <Sparkles className="w-3.5 h-3.5 text-[#1D5A4A] animate-pulse" />
            </h4>
            <p className="text-xs text-[#6B736D]">
              Cross-referencing 250M+ entities, verifying taboo protocols and corporate policy ceiling...
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#1D5A4A] bg-white px-3 py-1 rounded-full border border-[#C8DCD1]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span>QLOO_LIVE_INFERENCE</span>
        </div>
      </div>

      {/* Taste Graph Shimmer Card */}
      <div className="border border-[#183D33]/15 rounded-3xl p-6 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBE6DD]">
          <div className="h-5 w-48 rounded-lg bg-gradient-to-r from-[#F4F1EA] via-[#E2EFE7] to-[#F4F1EA] bg-[length:200%_100%] animate-gold-shimmer" />
          <div className="h-6 w-24 rounded-full bg-gradient-to-r from-[#F4F1EA] via-[#E2EFE7] to-[#F4F1EA] bg-[length:200%_100%] animate-gold-shimmer" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-[#E8F2EC] to-[#FAF8F5] bg-[length:200%_100%] animate-gold-shimmer border border-[#EBE6DD]"
            />
          ))}
        </div>
      </div>

      {/* Gifts Proposals Shimmer Card */}
      <div className="border border-[#183D33]/15 rounded-3xl p-6 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBE6DD]">
          <div className="h-5 w-56 rounded-lg bg-gradient-to-r from-[#F4F1EA] via-[#E2EFE7] to-[#F4F1EA] bg-[length:200%_100%] animate-gold-shimmer" />
          <div className="h-8 w-28 rounded-lg bg-gradient-to-r from-[#F4F1EA] via-[#E2EFE7] to-[#F4F1EA] bg-[length:200%_100%] animate-gold-shimmer" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#FAF8F5]/80 border border-[#EBE6DD] space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 rounded bg-gradient-to-r from-[#F4F1EA] via-[#E2EFE7] to-[#F4F1EA] bg-[length:200%_100%] animate-gold-shimmer" />
              <div className="h-6 w-20 rounded bg-gradient-to-r from-[#F4F1EA] via-[#E2EFE7] to-[#F4F1EA] bg-[length:200%_100%] animate-gold-shimmer" />
            </div>
            <div className="h-4 w-3/4 rounded bg-gradient-to-r from-[#F4F1EA] via-[#E2EFE7] to-[#F4F1EA] bg-[length:200%_100%] animate-gold-shimmer" />
            <div className="h-3 w-1/2 rounded bg-gradient-to-r from-[#F4F1EA] via-[#E2EFE7] to-[#F4F1EA] bg-[length:200%_100%] animate-gold-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};
