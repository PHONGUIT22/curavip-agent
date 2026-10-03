'use client';

import React from 'react';
import { Gift, Download, Sparkles, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import type { ExecutiveDossier, GiftProposal } from '../../types';

interface CuratedGiftCardProps {
  dossier: ExecutiveDossier;
}

export const CuratedGiftCard: React.FC<CuratedGiftCardProps> = ({ dossier }) => {
  const gifts = dossier.curatedGifts || [];

  const handleExport = () => {
    pdfService.exportExecutiveDossierPdf(dossier);
  };

  return (
    <div className="luxury-card p-6 border-champagne-500/20 hover:border-champagne-500/40 transition-all">
      {/* Header with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-champagne-400 font-bold">
              Bespoke Gifting Curation
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-champagne-500/15 text-champagne-400 border border-champagne-500/30 uppercase font-semibold">
              3 Tiered Proposals
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-100">
            Curated Executive Artifacts
          </h3>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-champagne-400 border border-champagne-500/30 text-xs font-mono font-medium transition-all hover:border-champagne-500/60 shadow-sm"
          title="Download formal 1-page PDF presentation for CEO sign-off"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Presentation (PDF)</span>
        </button>
      </div>

      {/* 3 Tier Cards Grid */}
      <div className="space-y-4">
        {gifts.map((gift, idx) => {
          const tierLabel =
            gift.tier === 'signature'
              ? 'Signature Proposal'
              : gift.tier === 'alternative'
              ? 'Alternative Aesthetic'
              : 'Discreet / Supplementary';

          return (
            <div
              key={gift.id}
              className="p-5 rounded-xl bg-obsidian-800/80 border border-white/[0.07] hover:border-champagne-500/40 transition-all relative overflow-hidden group"
            >
              {/* Subtle gold hairline accent on hover */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-champagne-500/30 group-hover:bg-champagne-500 transition-colors" />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 pl-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-champagne-400 font-bold">
                      {tierLabel}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      · {gift.brandOrArtisan}
                    </span>
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-stone-100 group-hover:text-champagne-300 transition-colors">
                    {gift.title}
                  </h4>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                  <span className="font-mono text-base font-bold text-champagne-400">
                    ${gift.estimatedPriceUsd.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-stone-400">
                    USD Est.
                  </span>
                </div>
              </div>

              {/* Qloo Provenance Anchor Badge */}
              <div className="mb-3 pl-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-champagne-500/10 border border-champagne-500/25 text-[11px] font-mono text-champagne-400">
                  <Sparkles className="w-3 h-3 text-champagne-400" />
                  <span>Qloo Provenance Anchor: {gift.qlooCorrelationAnchor}</span>
                </div>
              </div>

              {/* Cultural Rationale */}
              <p className="text-xs text-stone-300 leading-relaxed pl-2 font-sans">
                {gift.culturalRationale}
              </p>

              {/* Materials / Guardrail notes */}
              {gift.materials && gift.materials.length > 0 && (
                <div className="mt-3 pl-2 flex items-center gap-2 text-[10px] font-mono text-stone-400">
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
