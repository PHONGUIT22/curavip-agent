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
      <div className="luxury-card p-12 text-center border-dashed border-white/[0.08]">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-champagne-500/10 border border-champagne-500/20 flex items-center justify-center">
          <span className="font-serif text-xl font-bold text-champagne-400">CV</span>
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-200 mb-1">
          No Executive Dossier Loaded
        </h3>
        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
          Select a VIP principal above and compose a dossier to explore their Qloo-grounded cultural taste graph, bespoke gifts, and compliance audit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-slide">
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
