'use client';

import React from 'react';
import { Utensils, MapPin, Sparkles, GlassWater } from 'lucide-react';
import type { DiningProposal } from '../../types';

interface DiningProposalCardProps {
  diningOptions: DiningProposal[];
}

export const DiningProposalCard: React.FC<DiningProposalCardProps> = ({ diningOptions }) => {
  if (!diningOptions || diningOptions.length === 0) return null;

  return (
    <div className="luxury-card p-6 border-champagne-500/20 hover:border-champagne-500/40 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-champagne-400 font-bold">
              Executive Hospitality
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-champagne-500/15 text-champagne-400 border border-champagne-500/30 uppercase font-semibold">
              Private Salon & Dining
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-100">
            Curated Dining Reservations
          </h3>
        </div>

        <div className="w-9 h-9 rounded-xl bg-champagne-500/10 border border-champagne-500/25 flex items-center justify-center">
          <Utensils className="w-4 h-4 text-champagne-400" />
        </div>
      </div>

      <div className="space-y-4">
        {diningOptions.map((option) => (
          <div
            key={option.id}
            className="p-5 rounded-xl bg-obsidian-800/80 border border-white/[0.07] hover:border-champagne-500/30 transition-all relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-champagne-400 mb-0.5">
                  <span>{option.cuisineType}</span>
                  {option.priceBand && <span>· {option.priceBand}</span>}
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-100">
                  {option.venueName}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-400 font-sans">
                <MapPin className="w-3.5 h-3.5 text-champagne-400" />
                <span>{option.neighborhood}</span>
              </div>
            </div>

            {/* Vibe Anchor */}
            <div className="mb-2 text-xs text-stone-300 font-sans">
              <span className="text-stone-500 uppercase font-mono text-[10px] mr-1.5">Atmosphere:</span>
              <span className="text-stone-200">{option.vibeAnchor}</span>
            </div>

            {/* Pairing protocol */}
            <div className="mb-3 p-3 rounded-lg bg-obsidian-900/60 border border-white/[0.04] text-xs text-stone-300 flex items-start gap-2">
              <GlassWater className="w-3.5 h-3.5 text-champagne-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase text-champagne-400 block mb-0.5">Pairing Protocol</span>
                <span className="font-sans leading-relaxed">{option.pairingNotes}</span>
              </div>
            </div>

            {/* Cultural Rationale */}
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              {option.culturalRationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
