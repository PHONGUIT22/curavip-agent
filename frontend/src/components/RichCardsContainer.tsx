'use client';

import React from 'react';
import { TasteDossierCard } from './RichCards/TasteDossierCard';
import { CuratedGiftCard } from './RichCards/CuratedGiftCard';
import { ComplianceAuditCard } from './RichCards/ComplianceAuditCard';
import { DiningProposalCard } from './RichCards/DiningProposalCard';
import type { ExecutiveDossier } from '../types';

interface RichCardsContainerProps {
  dossier: ExecutiveDossier | null;
}

export const RichCardsContainer: React.FC<RichCardsContainerProps> = ({ dossier }) => {
  if (!dossier) {
    return (
      <div className="border border-stone-800 bg-[#0B0B10] p-12 text-center">
        <div className="w-10 h-10 mx-auto mb-3 border border-stone-800 bg-[#070709] flex items-center justify-center">
          <span className="font-sans text-base font-bold text-champagne-400">CV</span>
        </div>
        <h3 className="font-sans text-base font-semibold text-stone-200 mb-1 tracking-tight">
          No Executive Dossier Loaded
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed font-sans">
          Select a VIP principal above and synthesize a dossier to populate their Qloo taste graph, bespoke gifts, and compliance audit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Cultural Taste Graph & Ice-Breakers */}
      <TasteDossierCard
        tasteGraph={dossier.tasteGraph}
        vipProfile={dossier.vipProfile}
        iceBreakerScripts={dossier.iceBreakerScripts}
      />

      {/* 2. Curated Gifts with Qloo Provenance Anchors */}
      <CuratedGiftCard dossier={dossier} />

      {/* 3. Executive Dining Reservations */}
      <DiningProposalCard diningOptions={dossier.diningOptions} />

      {/* 4. FCPA & Taboo Compliance Guardrails */}
      <ComplianceAuditCard audit={dossier.complianceAudit} />
    </div>
  );
};
