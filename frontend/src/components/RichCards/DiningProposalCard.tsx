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
    <div className="border border-[#E5E0D6] bg-white rounded-sm p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#EBE6DD]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#183D33]">
              Executive Hospitality
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 border border-[#E5E0D6] bg-[#FAF8F5] text-[#6B736D] rounded-sm uppercase tracking-wide">
              Private Salon & Dining
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-[#161A18] tracking-tight">
            Curated Dining Reservations
          </h3>
        </div>

        <div className="w-9 h-9 border border-[#E5E0D6] bg-[#FAF8F5] rounded-sm flex items-center justify-center text-[#183D33]">
          <Utensils className="w-4 h-4" />
        </div>
      </div>

      {/* Proposals with 1px Ledger Dividers */}
      <div className="divide-y divide-[#EBE6DD] border border-[#E5E0D6] bg-white rounded-sm">
        {diningOptions.map((option) => (
          <div key={option.id} className="p-5.5 transition-colors hover:bg-[#FAF8F5]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#183D33] mb-1">
                  <span>{option.cuisineType}</span>
                  {option.priceBand && <span className="text-[#6B736D]">/ {option.priceBand}</span>}
                </div>
                <h4 className="text-lg font-semibold text-[#161A18] tracking-normal">
                  {option.venueName}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-[#6B736D] font-medium">
                <MapPin className="w-4 h-4 text-[#183D33]" />
                <span>{option.neighborhood}</span>
              </div>
            </div>

            {/* Vibe Anchor */}
            <div className="mb-2.5 text-sm text-[#323835] font-sans">
              <span className="text-[#6B736D] uppercase text-xs font-semibold mr-2 tracking-wide">
                Atmosphere:
              </span>
              <span className="text-[#161A18] font-medium">{option.vibeAnchor}</span>
            </div>

            {/* Pairing protocol */}
            <div className="mb-3 p-3.5 border border-[#E5E0D6] bg-[#FAF8F5] text-sm text-[#323835] flex items-start gap-2.5 rounded-sm">
              <GlassWater className="w-4 h-4 text-[#183D33] mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#183D33] block mb-1">
                  Pairing Protocol
                </span>
                <span className="font-sans leading-relaxed text-[#323835]">{option.pairingNotes}</span>
              </div>
            </div>

            {/* Cultural Rationale */}
            <p className="text-base text-[#323835] leading-relaxed font-sans font-normal">
              {option.culturalRationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
