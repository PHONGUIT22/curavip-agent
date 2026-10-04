'use client';

import React from 'react';
import { Compass, Sparkles, MessageSquareQuote, Layers } from 'lucide-react';
import type { CulturalTasteGraph, VIPProfile } from '../../types';

interface TasteDossierCardProps {
  tasteGraph: CulturalTasteGraph;
  vipProfile: VIPProfile;
  iceBreakerScripts: string[];
}

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
    <div className="border border-stone-800 bg-[#0B0B10] p-5">
      {/* Ledger Section Header */}
      <div className="flex items-start justify-between gap-4 pb-3 mb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-champagne-400">
              Archival Taste Graph
            </span>
            <span
              className={`text-[9px] font-sans font-medium px-1.5 py-0.5 border uppercase ${
                isGrounded
                  ? 'border-emeraldStatus/40 bg-emeraldStatus/10 text-emeraldStatus'
                  : 'border-stone-700 bg-stone-900 text-stone-400'
              }`}
            >
              {isGrounded ? 'Qloo Grounded' : 'Ungrounded Baseline'}
            </span>
          </div>
          <h3 className="font-sans font-semibold text-lg text-stone-100 tracking-tight">
            {vipProfile.fullName}{' '}
            <span className="font-sans text-xs text-neutral-400 font-normal">
              / Cultural Affinity Ledger
            </span>
          </h3>
        </div>

        <div className="w-8 h-8 border border-stone-800 bg-[#070709] flex items-center justify-center text-champagne-400">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* 3 Crisp Ledger Points (Anti-Slop: No fake-philosophical italics) */}
      <div className="border border-stone-800 bg-[#070709] p-3.5 mb-5">
        <div className="flex items-center gap-2 mb-2 text-champagne-400 text-xs font-sans font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SYNTHESIZED CROSS-DOMAIN THEME</span>
        </div>
        <div className="space-y-1.5 font-sans text-xs">
          {ledgerPoints.map((pt, idx) => (
            <div key={idx} className="flex items-baseline gap-2 text-stone-200">
              <span className="text-champagne-500 font-bold">•</span>
              <span className="font-medium text-neutral-400">{pt.label}:</span>
              <span className="text-stone-100 font-normal">{pt.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Entity Nodes Grid */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5 text-[10px] font-sans font-medium uppercase text-stone-400 tracking-wider">
          <Layers className="w-3.5 h-3.5 text-champagne-400" />
          <span>Correlated Taste Nodes</span>
        </div>

        {entities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="flex items-center justify-between p-2.5 border border-stone-800 bg-[#070709] text-xs hover:border-stone-700 transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-sans text-xs text-champagne-400/80 font-medium tracking-wide block mb-0.5">
                    [{entity.category.slice(0, 4).toUpperCase()}]
                  </span>
                  <span className="font-sans text-stone-200 font-medium truncate block">
                    {entity.name}
                  </span>
                </div>
                <span className="font-sans tabular-nums text-xs text-neutral-300 font-normal flex-shrink-0">
                  {Math.round(entity.affinityScore * 100)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 border border-stone-800 bg-[#070709] text-center text-xs font-sans text-stone-500">
            No correlated nodes surfaced in ungrounded baseline mode.
          </div>
        )}
      </div>

      {/* Strategic Conversational Openings (Diplomatic Ice-Breakers) */}
      <div>
        <div className="flex items-center gap-2 mb-2.5 text-[10px] font-sans font-medium uppercase text-champagne-400 tracking-wider">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Strategic Conversational Openings</span>
        </div>

        <div className="divide-y divide-stone-800 border border-stone-800 bg-[#070709]">
          {iceBreakerScripts.map((script, idx) => (
            <div key={idx} className="p-3 text-xs leading-relaxed">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-sans text-[10px] text-champagne-400 font-semibold">
                  [{String(idx + 1).padStart(2, '0')}]
                </span>
                <span className="font-sans text-[10px] text-neutral-400 uppercase tracking-wider font-medium">
                  Executive Opening Script
                </span>
              </div>
              <p className="font-sans text-xs text-stone-200 pl-6 leading-relaxed">
                {script}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
