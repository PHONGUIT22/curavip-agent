'use client';

import React from 'react';
import { X, Sparkles, AlertOctagon, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import type { DossierComparisonResponse } from '../types';

interface SideBySideComparisonViewProps {
  comparison: DossierComparisonResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SideBySideComparisonView: React.FC<SideBySideComparisonViewProps> = ({
  comparison,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !comparison) return null;

  const { grounded, generic } = comparison;
  const groundedVip = grounded.dossier.vipProfile;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="luxury-card w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border-champagne-500/30 shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-obsidian-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-champagne-400 font-bold">
                Competitive Benchmark
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-champagne-500/15 text-champagne-400 border border-champagne-500/25">
                The Cultural Grounding Difference
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-100">
              Why Generic LLMs Fail High-Ticket Dealmakers: {groundedVip.fullName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-obsidian-700 text-stone-400 hover:text-stone-100 hover:bg-obsidian-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Split Comparison Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] overflow-y-auto p-6 gap-6 bg-obsidian-900/90">
          {/* COLUMN 1: GENERIC LLM BASELINE (UNGROUNDED) */}
          <div className="space-y-5">
            {/* Column Title */}
            <div className="p-4 rounded-xl bg-crimsonAlert/10 border border-crimsonAlert/25">
              <div className="flex items-center gap-2 text-crimsonAlert font-mono text-xs font-bold uppercase mb-1">
                <Zap className="w-4 h-4" />
                <span>Generic LLM Baseline (Without Qloo)</span>
              </div>
              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                Relies on statistical corporate clichés. Guesswork fails taboo protocols and offers forgettable commodities.
              </p>
            </div>

            {/* Compliance Fail Callout */}
            <div className="p-3.5 rounded-lg bg-obsidian-800 border border-crimsonAlert/30">
              <div className="flex items-center gap-2 text-xs font-mono text-crimsonAlert font-bold mb-1">
                <AlertOctagon className="w-4 h-4" />
                <span>Governance Risk: Taboo & FCPA Violations</span>
              </div>
              <ul className="text-xs text-stone-300 list-disc list-inside space-y-1 font-sans">
                {generic.dossier.complianceAudit.tabooViolations.length > 0 ? (
                  generic.dossier.complianceAudit.tabooViolations.map((v, i) => (
                    <li key={i} className="text-crimsonAlert">{v}</li>
                  ))
                ) : (
                  <li className="text-amberCaution">Generic luxury padfolio with unauthorized pigskin/animal material.</li>
                )}
              </ul>
            </div>

            {/* Cliché Gifts */}
            <div>
              <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider block mb-2 font-semibold">
                Generic Gift Proposals
              </span>
              <div className="space-y-2.5">
                {generic.dossier.curatedGifts.map((gift) => (
                  <div key={gift.id} className="p-3.5 rounded-xl bg-obsidian-800/80 border border-white/[0.05]">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-serif font-bold text-sm text-stone-200">{gift.title}</h4>
                      <span className="font-mono text-xs text-stone-400 font-bold">${gift.estimatedPriceUsd}</span>
                    </div>
                    <span className="text-[10px] font-mono text-crimsonAlert/90 block mb-1">
                      Anchor: {gift.qlooCorrelationAnchor}
                    </span>
                    <p className="text-xs text-stone-400 font-sans leading-relaxed">
                      {gift.culturalRationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cliché Ice-Breakers */}
            <div>
              <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider block mb-2 font-semibold">
                Superficial Conversation Openers
              </span>
              <div className="space-y-2">
                {generic.dossier.iceBreakerScripts.map((script, i) => (
                  <div key={i} className="p-3 rounded-lg bg-obsidian-800/60 border border-white/[0.04] text-xs font-serif italic text-stone-400">
                    {script}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: QLOO GROUNDED CONCIERGE (CURAVIP) */}
          <div className="space-y-5">
            {/* Column Title */}
            <div className="p-4 rounded-xl bg-emeraldStatus/10 border border-emeraldStatus/25">
              <div className="flex items-center gap-2 text-emeraldStatus font-mono text-xs font-bold uppercase mb-1">
                <Sparkles className="w-4 h-4 text-champagne-400" />
                <span>CuraVIP (Qloo Taste Graph Grounded)</span>
              </div>
              <p className="text-xs text-stone-200 font-sans leading-relaxed">
                Anchored in 250M+ cultural entities. Cross-domain inference connects cinema, architecture, and artisan craft.
              </p>
            </div>

            {/* Compliance Passed Callout */}
            <div className="p-3.5 rounded-lg bg-obsidian-800 border border-emeraldStatus/30">
              <div className="flex items-center gap-2 text-xs font-mono text-emeraldStatus font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% FCPA & Taboo Compliant Verified</span>
              </div>
              <p className="text-xs text-stone-300 font-sans">
                Zero alcohol infractions. Zero dietary violations. Strictly audited under corporate ceiling (${grounded.dossier.complianceAudit.effectiveBudgetCapUsd}).
              </p>
            </div>

            {/* Grounded Bespoke Gifts */}
            <div>
              <span className="text-[10px] font-mono uppercase text-champagne-400 tracking-wider block mb-2 font-semibold">
                Grounded Bespoke Artifacts
              </span>
              <div className="space-y-2.5">
                {grounded.dossier.curatedGifts.map((gift) => (
                  <div key={gift.id} className="p-3.5 rounded-xl bg-obsidian-800/80 border border-champagne-500/25">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-serif font-bold text-sm text-champagne-200">{gift.title}</h4>
                      <span className="font-mono text-xs text-champagne-400 font-bold">${gift.estimatedPriceUsd}</span>
                    </div>
                    <span className="text-[10px] font-mono text-champagne-400 block mb-1">
                      Anchor: {gift.qlooCorrelationAnchor}
                    </span>
                    <p className="text-xs text-stone-300 font-sans leading-relaxed">
                      {gift.culturalRationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grounded Ice-Breakers */}
            <div>
              <span className="text-[10px] font-mono uppercase text-champagne-400 tracking-wider block mb-2 font-semibold">
                Diplomatic Rapport Openings
              </span>
              <div className="space-y-2">
                {grounded.dossier.iceBreakerScripts.map((script, i) => (
                  <div key={i} className="p-3 rounded-lg bg-obsidian-800/80 border border-champagne-500/20 text-xs font-serif italic text-stone-200">
                    {script}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-obsidian-800 flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono">
            Powered by Qloo Taste Graph Correlation Engine & Model Context Protocol
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-champagne-500 text-obsidian-900 text-xs font-mono font-bold hover:brightness-110 transition-all"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
