'use client';

import React, { useState } from 'react';
import { Download, Shield, Tag, PackageCheck, Share2 } from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import { soundService } from '../../services/soundService';
import { QlooAffinityBadge } from '../QlooAffinityBadge';
import { ActionDispatchModal, ActionModalData } from '../ActionDispatchModal';
import type { ExecutiveDossier } from '../../types';

interface CuratedGiftCardProps {
  dossier: ExecutiveDossier;
}

export const CuratedGiftCard: React.FC<CuratedGiftCardProps> = ({ dossier }) => {
  const [actionModalData, setActionModalData] = useState<ActionModalData | null>(null);
  const gifts = dossier.curatedGifts || [];

  const handleExport = () => {
    pdfService.exportExecutiveDossierPdf(dossier);
  };

  return (
    <div className="border border-[#183D33]/15 bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
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

      {/* 3 Tier Proposals as Dedicated Sub-Cards */}
      <div>
        {gifts.map((gift) => {
          const tierLabel =
            gift.tier === 'signature'
              ? 'Signature Proposal'
              : gift.tier === 'alternative'
              ? 'Alternative Aesthetic'
              : 'Discreet Proposal';

          return (
            <div
              key={gift.id}
              className="bg-[#FAF8F5]/60 border border-[#EBE6DD] rounded-xl p-5 sm:p-6 mb-4 last:mb-0 space-y-3 transition-colors hover:bg-white hover:border-[#183D33]/30 shadow-2xs"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#183D33]">
                  {tierLabel}
                </span>
                <span className="text-xs text-[#6B736D] font-medium">
                  / {gift.brandOrArtisan}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-sans font-semibold text-lg text-[#161A18] leading-snug flex-1 min-w-0 pr-2">
                  {gift.title}
                </h4>
                <span className="font-sans font-semibold text-sm sm:text-base text-[#183D33] tabular-nums shrink-0 whitespace-nowrap bg-[#183D33]/5 px-2.5 py-1 rounded-md">
                  ${gift.estimatedPriceUsd.toLocaleString()}
                </span>
              </div>

              {/* Qloo Provenance Anchor Badge (Warm Mint & Jade) & Affinity Why This */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C8DCD1] bg-[#EDF4F0] text-xs font-medium text-[#1E4D3E]">
                  <Shield className="w-3.5 h-3.5 text-[#1E4D3E]" />
                  <span>Qloo Provenance Anchor: {gift.qlooCorrelationAnchor}</span>
                </div>
                <QlooAffinityBadge
                  affinityScore={gift.affinityScore || 0.94}
                  anchor={gift.qlooCorrelationAnchor}
                  itemTitle={gift.title}
                />
              </div>

              {/* Cultural Rationale */}
              <p className="font-sans text-sm sm:text-base text-[#323835] leading-relaxed font-normal">
                {gift.culturalRationale}
              </p>

              {/* Materials / Guardrail notes */}
              {gift.materials && gift.materials.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-medium text-[#6B736D] pt-1">
                  <Tag className="w-3.5 h-3.5 text-[#8C938E]" />
                  <span>Verified Materials: {gift.materials.join(', ')}</span>
                </div>
              )}

              {/* 1-Click Agentic Action Dispatch Bar */}
              <div className="pt-3 border-t border-[#EBE6DD] flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playMechanicalClick();
                    setActionModalData({
                      type: 'commission_gift',
                      title: gift.title,
                      venueOrBrand: gift.brandOrArtisan,
                      vipName: dossier.vipProfile.fullName,
                      price: `$${gift.estimatedPriceUsd.toLocaleString()}`,
                      notes: gift.culturalRationale,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#183D33] hover:bg-[#224F43] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-2xs"
                  title="Commission bespoke craft via independent atelier"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Commission via Atelier</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playMechanicalClick();
                    setActionModalData({
                      type: 'share_briefing',
                      title: gift.title,
                      venueOrBrand: gift.brandOrArtisan,
                      vipName: dossier.vipProfile.fullName,
                      price: `$${gift.estimatedPriceUsd.toLocaleString()}`,
                      notes: gift.culturalRationale,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6B736D] hover:text-[#183D33] hover:bg-[#FAF8F5] rounded-lg transition-colors border border-transparent hover:border-[#E5E0D6]"
                  title="Dispatch gift briefing via WhatsApp / Signal"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp / Signal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Dispatch Modal */}
      <ActionDispatchModal
        data={actionModalData}
        isOpen={Boolean(actionModalData)}
        onClose={() => setActionModalData(null)}
      />
    </div>
  );
};
