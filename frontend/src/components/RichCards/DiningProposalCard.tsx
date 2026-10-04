'use client';

import React from 'react';
import { Utensils, MapPin, GlassWater } from 'lucide-react';
import { QlooAffinityBadge } from '../QlooAffinityBadge';
import type { DiningProposal } from '../../types';

interface DiningProposalCardProps {
  diningOptions: DiningProposal[];
}

export const DiningProposalCard: React.FC<DiningProposalCardProps> = ({ diningOptions }) => {
  if (!diningOptions || diningOptions.length === 0) return null;

  return (
    <div className="border border-[#183D33]/15 bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#EBE6DD]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#183D33]">
              Executive Hospitality
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 border border-[#E5E0D6] bg-[#FAF8F5] text-[#6B736D] rounded-full uppercase tracking-wide">
              Private Salon & Dining
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-[#161A18] tracking-tight">
            Curated Dining Reservations
          </h3>
        </div>

        <div className="w-9 h-9 border border-[#E5E0D6] bg-[#FAF8F5] rounded-lg flex items-center justify-center text-[#183D33]">
          <Utensils className="w-4 h-4" />
        </div>
      </div>

      {/* Proposals as Dedicated Sub-Cards with Modern Luxury Padding */}
      <div className="space-y-4">
        {diningOptions.map((option) => (
          <div
            key={option.id}
            className="p-5 sm:p-6 rounded-2xl border border-[#EBE6DD] bg-[#FAF8F5]/70 space-y-3.5 mb-4 shadow-2xs transition-colors hover:bg-white hover:border-[#183D33]/30"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#183D33] mb-1">
                  <span>{option.cuisineType}</span>
                  {option.priceBand && <span className="text-[#6B736D]">/ {option.priceBand}</span>}
                  <QlooAffinityBadge
                    affinityScore={0.96}
                    anchor={option.cuisineType}
                    itemTitle={option.venueName}
                    explanation={`Dữ liệu Qloo Cross-Domain: Khách hàng có gu thẩm mỹ cao cấp và lối sống tinh tế có 96% độ phù hợp văn hóa với không gian ẩm thực ${option.vibeAnchor} tại ${option.venueName}.`}
                  />
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
            <div className="my-3 text-sm text-[#323835] leading-relaxed font-sans">
              <span className="text-[#6B736D] uppercase text-xs font-semibold mr-2 tracking-wide">
                Atmosphere:
              </span>
              <span className="text-[#161A18] font-medium">{option.vibeAnchor}</span>
            </div>

            {/* Pairing protocol with roomy padding and soft warm canvas */}
            <div className="p-4 sm:p-5 rounded-xl border border-[#E5E0D6] bg-[#F8F6F0] flex items-start gap-3.5 text-sm text-[#323835]">
              <GlassWater className="w-4 h-4 text-[#183D33] mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#183D33] block mb-1">
                  Pairing Protocol
                </span>
                <span className="font-sans leading-relaxed text-[#323835]">{option.pairingNotes}</span>
              </div>
            </div>

            {/* Cultural Rationale */}
            <p className="my-3 text-sm text-[#323835] leading-relaxed font-sans font-normal">
              {option.culturalRationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
