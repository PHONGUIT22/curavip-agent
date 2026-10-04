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

  return (
    <div className="border border-stone-800 bg-[#0B0B10] p-5">
      {/* Ledger Section Header */}
      <div className="flex items-start justify-between gap-4 pb-3 mb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-champagne-400 font-bold">
              Archival Taste Graph
            </span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 border uppercase font-bold ${
                isGrounded
                  ? 'border-emeraldStatus/40 bg-emeraldStatus/10 text-emeraldStatus'
                  : 'border-stone-700 bg-stone-900 text-stone-400'
              }`}
            >
              {isGrounded ? 'Qloo Grounded' : 'Ungrounded Baseline'}
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-100">
            {vipProfile.fullName} / Cultural Affinity Ledger
          </h3>
        </div>

        <div className="w-8 h-8 border border-stone-800 bg-[#070709] flex items-center justify-center text-champagne-400">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Synthesized Cross-Domain Theme Ledger Strip */}
      <div className="border border-stone-800 bg-[#070709] p-3.5 mb-5">
        <div className="flex items-center gap-2 mb-1.5 text-champagne-400 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SYNTHESIZED CROSS-DOMAIN THEME</span>
        </div>
        <p className="text-xs font-serif italic text-stone-200 leading-relaxed">
          &ldquo;
          {tasteGraph.crossDomainThemes && tasteGraph.crossDomainThemes.length > 0
            ? tasteGraph.crossDomainThemes.join(' / ')
            : 'Synthesizing latent correlations across material culture and architectural heritage.'}
          &rdquo;
        </p>
      </div>

      {/* Cultural Entity Nodes Grid */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5 text-[10px] font-mono uppercase text-stone-400 tracking-wider">
          <Layers className="w-3.5 h-3.5 text-champagne-400" />
          <span>Correlated Taste Nodes</span>
        </div>

        {entities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="flex items-center justify-between p-2.5 border border-stone-800 bg-[#070709] text-xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-[9px] font-mono uppercase text-champagne-400/80 block">
                    [{entity.category.slice(0, 4)}]
                  </span>
                  <span className="text-stone-200 font-medium truncate block">
                    {entity.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 font-bold flex-shrink-0">
                  {Math.round(entity.affinityScore * 100)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 border border-stone-800 bg-[#070709] text-center text-xs font-mono text-stone-500">
            No correlated nodes surfaced in ungrounded baseline mode.
          </div>
        )}
      </div>

      {/* Strategic Conversational Openings (Diplomatic Ice-Breakers) */}
      <div>
        <div className="flex items-center gap-2 mb-2.5 text-[10px] font-mono uppercase text-champagne-400 tracking-wider font-bold">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Strategic Conversational Openings</span>
        </div>

        <div className="divide-y divide-stone-800 border border-stone-800 bg-[#070709]">
          {iceBreakerScripts.map((script, idx) => (
            <div key={idx} className="p-3 text-xs leading-relaxed">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-champagne-400 font-bold">
                  [{String(idx + 1).padStart(2, '0')}]
                </span>
                <span className="text-[10px] font-mono text-stone-400 uppercase">
                  Executive Opening Script
                </span>
              </div>
              <p className="font-serif italic text-stone-300 pl-6">
                {script}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
