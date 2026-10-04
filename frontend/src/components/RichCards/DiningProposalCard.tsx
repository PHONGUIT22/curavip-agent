'use client';

import React from 'react';
import { Utensils, MapPin, GlassWater } from 'lucide-react';
import type { DiningProposal } from '../../types';

interface DiningProposalCardProps {
  diningOptions: DiningProposal[];
}

export const DiningProposalCard: React.FC<DiningProposalCardProps> = ({ diningOptions }) => {
  if (!diningOptions || diningOptions.length === 0) return null;

  return (
    <div className="border border-stone-800 bg-[#0B0B10] p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-3 mb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-champagne-400">
              Executive Hospitality
            </span>
            <span className="text-[9px] font-sans font-medium px-1.5 py-0.5 border border-stone-800 bg-[#070709] text-stone-300 uppercase">
              Private Salon & Dining
            </span>
          </div>
          <h3 className="text-xl font-medium text-white tracking-tight">
            Curated Dining Reservations
          </h3>
        </div>

        <div className="w-8 h-8 border border-stone-800 bg-[#070709] flex items-center justify-center text-champagne-400">
          <Utensils className="w-4 h-4" />
        </div>
      </div>

      {/* Proposals with 1px Ledger Dividers */}
      <div className="divide-y divide-stone-800 border border-stone-800 bg-[#070709]">
        {diningOptions.map((option) => (
          <div key={option.id} className="p-4 transition-colors hover:bg-[#0E0E16]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-sans font-medium text-champagne-400 mb-0.5">
                  <span>{option.cuisineType}</span>
                  {option.priceBand && <span>/ {option.priceBand}</span>}
                </div>
                <h4 className="text-base font-semibold text-white tracking-normal">
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
              <span className="text-stone-500 uppercase font-sans font-medium text-[10px] mr-1.5">Atmosphere:</span>
              <span className="text-stone-200">{option.vibeAnchor}</span>
            </div>

            {/* Pairing protocol */}
            <div className="mb-2 p-2.5 border border-stone-800 bg-[#0B0B10] text-xs text-stone-300 flex items-start gap-2">
              <GlassWater className="w-3.5 h-3.5 text-champagne-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-sans font-medium uppercase text-champagne-400 block mb-0.5">
                  Pairing Protocol
                </span>
                <span className="font-sans leading-relaxed text-stone-300">{option.pairingNotes}</span>
              </div>
            </div>

            {/* Cultural Rationale */}
            <p className="text-sm text-neutral-300 leading-relaxed font-sans font-normal">
              {option.culturalRationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
