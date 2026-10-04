'use client';

import React from 'react';
import { Download, Sparkles, Tag } from 'lucide-react';
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
    <div className="border border-stone-800 bg-[#0B0B10] p-5">
      {/* Header with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-champagne-400 font-bold">
              Archival Curation
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 border border-stone-800 bg-[#070709] text-stone-300 uppercase font-semibold">
              3 Tier Proposals
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Curated Executive Artifacts
          </h3>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 border border-stone-800 bg-[#070709] hover:border-champagne-500/50 text-champagne-400 text-xs font-mono uppercase tracking-wider transition-colors"
          title="Export 1-page presentation for committee sign-off"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger (PDF)</span>
        </button>
      </div>

      {/* 3 Tier Proposals with 1px Ledger Borders */}
      <div className="divide-y divide-stone-800 border border-stone-800 bg-[#070709]">
        {gifts.map((gift) => {
          const tierLabel =
            gift.tier === 'signature'
              ? 'Signature Proposal'
              : gift.tier === 'alternative'
              ? 'Alternative Aesthetic'
              : 'Discreet Proposal';

          return (
            <div key={gift.id} className="p-4 transition-colors hover:bg-[#0E0E16]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-champagne-400 font-bold">
                      {tierLabel}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      / {gift.brandOrArtisan}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    {gift.title}
                  </h4>
                </div>

                <div className="text-right flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-1">
                  <span className="font-mono tabular-nums text-sm font-bold text-champagne-400">
                    ${gift.estimatedPriceUsd.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-mono uppercase text-stone-500">
                    USD Est.
                  </span>
                </div>
              </div>

              {/* Qloo Provenance Anchor Badge (Shape Consistency Lock: rounded-none) */}
              <div className="mb-2">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-stone-800 bg-[#0B0B10] text-[10px] font-mono text-champagne-400">
                  <Sparkles className="w-3 h-3 text-champagne-400" />
                  <span>Qloo Provenance Anchor: {gift.qlooCorrelationAnchor}</span>
                </div>
              </div>

              {/* Cultural Rationale */}
              <p className="text-xs text-stone-300 leading-relaxed font-sans mb-2">
                {gift.culturalRationale}
              </p>

              {/* Materials / Guardrail notes */}
              {gift.materials && gift.materials.length > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
                  <Tag className="w-3 h-3 text-stone-500" />
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
