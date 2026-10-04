'use client';

import React from 'react';
import { TasteDossierCard } from './RichCards/TasteDossierCard';
import { CuratedGiftCard } from './RichCards/CuratedGiftCard';
import { ComplianceAuditCard } from './RichCards/ComplianceAuditCard';
import { DiningProposalCard } from './RichCards/DiningProposalCard';
import { EmeraldSkeleton } from './EmeraldSkeleton';
import type { ExecutiveDossier } from '../types';

interface RichCardsContainerProps {
  dossier: ExecutiveDossier | null;
  isLoading?: boolean;
}

export const RichCardsContainer: React.FC<RichCardsContainerProps> = ({ dossier, isLoading = false }) => {
  if (isLoading) {
    return <EmeraldSkeleton />;
  }

  if (!dossier) {
    return (
      <div className="border border-[#E5E0D6]/80 bg-white rounded-2xl p-12 text-center shadow-sm">
        <div className="w-11 h-11 mx-auto mb-3.5 border border-[#E5E0D6] bg-[#FAF8F5] rounded-xl flex items-center justify-center">
          <span className="font-sans text-base font-bold text-[#183D33]">CV</span>
        </div>
        <h3 className="font-sans text-lg font-semibold text-[#161A18] mb-1.5 tracking-tight">
          No Executive Dossier Loaded
        </h3>
        <p className="text-sm text-[#6B736D] max-w-md mx-auto leading-relaxed font-sans">
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
