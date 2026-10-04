'use client';

import React from 'react';
import { Compass, MessageSquareQuote, Layers } from 'lucide-react';
import type { CulturalTasteGraph, VIPProfile } from '../../types';

interface TasteDossierCardProps {
  tasteGraph: CulturalTasteGraph;
  vipProfile: VIPProfile;
  iceBreakerScripts: string[];
}

const getCategoryLabel = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('musi') || cat.includes('artist')) return 'Music';
  if (cat.includes('dini') || cat.includes('place') || cat.includes('culin')) return 'Dining';
  if (cat.includes('lite') || cat.includes('book')) return 'Literature';
  if (cat.includes('fash') || cat.includes('brand')) return 'Fashion';
  if (cat.includes('arch')) return 'Architecture';
  if (cat.includes('film') || cat.includes('cinema') || cat.includes('movie')) return 'Cinema';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const TasteDossierCard: React.FC<TasteDossierCardProps> = ({
  tasteGraph,
  vipProfile,
  iceBreakerScripts,
}) => {
  const isGrounded = tasteGraph.source !== 'none';
  const entities = tasteGraph.expandedEntities || [];

  // Determine the 3 structured ledger points for the persona / taste profile
  const getLedgerPoints = () => {
    const id = vipProfile.id.toLowerCase();
    if (id.includes('marcus')) {
      return [
        { label: 'Primary Aesthetic', value: 'Brutalist Architecture & Monolithic Scale' },
        { label: 'Sonic Palette', value: 'Minimalist Soundscapes & Ambient Brass' },
        { label: 'Tactile Resonance', value: 'Untreated Concrete, Raw Cast Iron & Stoneware' },
      ];
    }
    if (id.includes('tariq')) {
      return [
        { label: 'Primary Aesthetic', value: 'Bauhaus Functionalism & Dieter Rams Industrial Design' },
        { label: 'Sonic Palette', value: 'Micro-Mechanical Frequency & Precision Horology' },
        { label: 'Tactile Resonance', value: 'Sandblasted Titanium, Cold-Drip Glass & Matte Ceramic' },
      ];
    }
    if (id.includes('elena')) {
      return [
        { label: 'Primary Aesthetic', value: 'Avant-Garde Deconstruction & Archival Haute Couture' },
        { label: 'Sonic Palette', value: 'Modal Jazz Improvisation & Analog Vinyl Resonance' },
        { label: 'Tactile Resonance', value: 'Raw Silk Organza, Biodynamic Terracotta & Washed Linen' },
      ];
    }

    // Default dynamic extraction from crossDomainThemes
    const themes = tasteGraph.crossDomainThemes || [];
    return [
      { label: 'Primary Aesthetic', value: themes[0] || 'Monolithic Precision & Architectural Tension' },
      { label: 'Sonic Palette', value: themes[1] || 'Ambient Acoustic Frequencies & Modal Cadence' },
      { label: 'Tactile Resonance', value: themes[2] || 'Artisanal Stoneware, Raw Fiber & Engineered Metals' },
    ];
  };

  const ledgerPoints = getLedgerPoints();

  return (
    <div className="border border-[#E5E0D6]/80 bg-white rounded-2xl p-6 shadow-sm">
      {/* Ledger Section Header */}
      <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#EBE6DD]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#183D33]">
              Archival Taste Graph
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 border rounded-full uppercase tracking-wide ${
                isGrounded
                  ? 'border-[#C8DCD1] bg-[#EDF4F0] text-[#1D5A4A]'
                  : 'border-[#E5E0D6] bg-[#FAF8F5] text-[#6B736D]'
              }`}
            >
              {isGrounded ? 'Qloo Grounded' : 'Ungrounded Baseline'}
            </span>
          </div>
          <h3 className="font-sans font-semibold text-xl text-[#161A18] tracking-tight">
            {vipProfile.fullName}{' '}
            <span className="font-sans text-sm text-[#6B736D] font-normal">
              / Cultural Affinity Ledger
            </span>
          </h3>
        </div>

        <div className="w-9 h-9 border border-[#E5E0D6] bg-[#FAF8F5] rounded-lg flex items-center justify-center text-[#183D33]">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* 3 Crisp Ledger Points (Anti-Slop: Structured Ledger Points) */}
      <div className="border border-[#E5E0D6] bg-[#FAF8F5] p-5 mb-6 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2 mb-2.5 text-[#183D33] text-xs font-semibold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#183D33]" />
          <span>Synthesized Cross-Domain Theme</span>
        </div>
        <div className="space-y-2 font-sans text-sm">
          {ledgerPoints.map((pt, idx) => (
            <div key={idx} className="flex items-baseline gap-2.5 text-[#161A18]">
              <span className="text-[#183D33] font-bold">•</span>
              <span className="font-semibold text-[#6B736D]">{pt.label}:</span>
              <span className="text-[#161A18] font-normal">{pt.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Entity Nodes Grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase text-[#6B736D] tracking-wider">
          <Layers className="w-4 h-4 text-[#183D33]" />
          <span>Correlated Taste Nodes</span>
        </div>

        {entities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="flex items-center justify-between p-3.5 border border-[#E5E0D6] bg-[#FAF8F5] hover:bg-white hover:border-[#183D33]/40 rounded-xl transition-all shadow-2xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-sans text-xs text-[#183D33] font-semibold tracking-wide block mb-0.5">
                    {getCategoryLabel(entity.category)}
                  </span>
                  <span className="font-sans text-xs font-semibold text-[#161A18] line-clamp-2 leading-relaxed block">
                    {entity.name}
                  </span>
                </div>
                <span className="font-sans tabular-nums text-sm font-semibold text-[#183D33] flex-shrink-0">
                  {Math.round(entity.affinityScore * 100)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 border border-[#E5E0D6] bg-[#FAF8F5] rounded-xl text-center text-sm font-medium text-[#6B736D]">
            No correlated nodes surfaced in ungrounded baseline mode.
          </div>
        )}
      </div>

      {/* Strategic Conversational Openings (Diplomatic Ice-Breakers) */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase text-[#183D33] tracking-wider">
          <MessageSquareQuote className="w-4 h-4" />
          <span>Strategic Conversational Openings</span>
        </div>

        <div className="divide-y divide-[#EBE6DD] border border-[#E5E0D6] bg-[#FAF8F5] rounded-xl overflow-hidden shadow-2xs">
          {iceBreakerScripts.map((script, idx) => (
            <div key={idx} className="p-4 text-sm leading-relaxed">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="font-sans text-xs text-[#183D33] font-semibold">
                  [{String(idx + 1).padStart(2, '0')}]
                </span>
                <span className="font-sans text-xs text-[#6B736D] uppercase tracking-wider font-semibold">
                  Executive Opening Script
                </span>
              </div>
              <p className="font-sans text-sm text-[#323835] pl-6 leading-relaxed">
                {script}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
