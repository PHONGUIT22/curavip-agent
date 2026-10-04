'use client';

import React from 'react';
import { Download, Shield, Tag } from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import type { ExecutiveDossier } from '../../types';

interface CuratedGiftCardProps {
  dossier: ExecutiveDossier;
}

export const CuratedGiftCard: React.FC<CuratedGiftCardProps> = ({ dossier }) => {
  const gifts = dossier.curatedGifts || [];

  const handleExport = () => {
    pdfService.exportExecutiveDossierPdf(dossier);
  };

  return (
    <div className="border border-[#E5E0D6]/80 bg-white rounded-2xl p-6 shadow-sm">
      {/* Header with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#EBE6DD]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#183D33]">
              Archival Curation
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 border border-[#E5E0D6] bg-[#FAF8F5] text-[#6B736D] rounded-full uppercase tracking-wide">
              3 Tier Proposals
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-[#161A18] tracking-tight">
            Curated Executive Artifacts
          </h3>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-[#E5E0D6] bg-[#FAF8F5] hover:border-[#183D33] text-[#183D33] text-xs font-semibold uppercase tracking-wider transition-colors rounded-lg shadow-sm"
          title="Export 1-page presentation for committee sign-off"
        >
          <Download className="w-4 h-4 text-[#183D33]" />
          <span>Export Ledger (PDF)</span>
        </button>
      </div>

      {/* 3 Tier Proposals with 1px Ledger Borders */}
      <div className="border border-[#E5E0D6] bg-white rounded-xl overflow-hidden shadow-2xs">
        {gifts.map((gift, idx) => {
          const tierLabel =
            gift.tier === 'signature'
              ? 'Signature Proposal'
              : gift.tier === 'alternative'
              ? 'Alternative Aesthetic'
              : 'Discreet Proposal';

          return (
            <div
              key={gift.id}
              className={`p-6 transition-colors hover:bg-[#FAF8F5] ${
                idx > 0 ? 'pt-6 mt-6 border-t border-[#EBE6DD]' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#183D33]">
                  {tierLabel}
                </span>
                <span className="text-xs text-[#6B736D] font-medium">
                  / {gift.brandOrArtisan}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-3">
                <h4 className="text-lg font-semibold text-[#161A18] tracking-normal leading-snug flex-1">
                  {gift.title}
                </h4>

                <div className="text-right flex items-baseline justify-between sm:justify-end gap-1.5 shrink-0">
                  <span className="font-sans font-semibold text-2xl text-[#183D33] tabular-nums">
                    ${gift.estimatedPriceUsd.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold uppercase text-[#6B736D]">
                    USD Est.
                  </span>
                </div>
              </div>

              {/* Qloo Provenance Anchor Badge (Warm Mint & Jade) */}
              <div className="mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C8DCD1] bg-[#EDF4F0] text-xs font-medium text-[#1E4D3E]">
                  <Shield className="w-3.5 h-3.5 text-[#1E4D3E]" />
                  <span>Qloo Provenance Anchor: {gift.qlooCorrelationAnchor}</span>
                </div>
              </div>

              {/* Cultural Rationale */}
              <p className="font-sans text-base text-[#323835] leading-relaxed font-normal mb-3">
                {gift.culturalRationale}
              </p>

              {/* Materials / Guardrail notes */}
              {gift.materials && gift.materials.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-medium text-[#6B736D]">
                  <Tag className="w-3.5 h-3.5 text-[#8C938E]" />
                  <span>Verified Materials: {gift.materials.join(', ')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
