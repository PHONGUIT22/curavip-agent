'use client';

import React from 'react';
import { Compass, Sparkles, MessageSquareQuote, Layers, ExternalLink } from 'lucide-react';
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

  // Group entities by domain
  const domains: Record<string, typeof entities> = {};
  for (const ent of entities) {
    if (!domains[ent.category]) domains[ent.category] = [];
    domains[ent.category].push(ent);
  }

  return (
    <div className="luxury-card p-6 border-champagne-500/20 hover:border-champagne-500/40 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-champagne-400 font-bold">
              Cultural Intelligence Graph
            </span>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                isGrounded
                  ? 'bg-emeraldStatus/15 text-emeraldStatus border border-emeraldStatus/30'
                  : 'bg-stone-800 text-stone-400 border border-white/[0.08]'
              }`}
            >
              {isGrounded ? 'Qloo Grounded' : 'Ungrounded Baseline'}
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-100">
            {vipProfile.fullName} · Taste Profile
          </h3>
        </div>

        <div className="w-9 h-9 rounded-xl bg-champagne-500/10 border border-champagne-500/25 flex items-center justify-center">
          <Compass className="w-4 h-4 text-champagne-400" />
        </div>
      </div>

      {/* Cross-Domain Themes Banner */}
      <div className="bg-obsidian-800/90 rounded-xl p-4 mb-6 border border-white/[0.06]">
        <div className="flex items-center gap-2 mb-2 text-champagne-400 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SYNTHESIZED CROSS-DOMAIN THEME</span>
        </div>
        <p className="text-sm font-serif italic text-stone-200 leading-relaxed">
          &ldquo;
          {tasteGraph.crossDomainThemes && tasteGraph.crossDomainThemes.length > 0
            ? tasteGraph.crossDomainThemes.join('  ·  ')
            : 'Synthesizing subtle correlations across material culture and architectural heritage.'}
          &rdquo;
        </p>
      </div>

      {/* Cultural Entity Nodes by Domain */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-mono uppercase text-stone-400 tracking-wider">
          <Layers className="w-3.5 h-3.5 text-champagne-400" />
          <span>Correlated Taste Nodes</span>
        </div>

        {entities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-obsidian-800 border border-white/[0.08] hover:border-champagne-500/40 transition-all text-xs"
              >
                <span className="text-[10px] font-mono uppercase text-champagne-400/80">
                  [{entity.category.slice(0, 4)}]
                </span>
                <span className="text-stone-200 font-medium">{entity.name}</span>
                <span className="text-[10px] font-mono text-stone-400 font-bold ml-1">
                  {Math.round(entity.affinityScore * 100)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-obsidian-800/60 border border-dashed border-white/[0.1] text-center text-xs text-stone-500">
            No correlated nodes surfaced in ungrounded baseline mode.
          </div>
        )}
      </div>

      {/* Strategic Conversational Ice-Breakers */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-[11px] font-mono uppercase text-champagne-400 tracking-wider font-semibold">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Strategic Conversational Openings (Diplomatic Ice-Breakers)</span>
        </div>

        <div className="space-y-2.5">
          {iceBreakerScripts.map((script, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-obsidian-800/80 border border-white/[0.06] hover:border-champagne-500/30 transition-all text-xs leading-relaxed"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-champagne-500/15 text-champagne-400 font-mono text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="text-[10px] font-mono text-stone-400 uppercase">Executive Opening</span>
              </div>
              <p className="font-serif italic text-stone-200 pl-6">
                {script}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
