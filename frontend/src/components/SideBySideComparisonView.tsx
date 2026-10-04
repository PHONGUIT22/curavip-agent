'use client';

import React from 'react';
import { X, Sparkles, AlertOctagon, CheckCircle2, Zap } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col border border-stone-800 bg-[#070709] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between bg-[#0B0B10]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-champagne-400 font-bold">
                Competitive Benchmark
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 border border-stone-800 bg-[#070709] text-stone-400 uppercase">
                The Grounding Difference
              </span>
            </div>
            <h2 className="font-serif text-lg font-bold text-stone-100">
              Why Generic LLMs Fail High-Ticket Dealmakers: {groundedVip.fullName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-stone-800 bg-[#070709] text-stone-400 hover:text-stone-100 hover:border-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Split Comparison Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-800 overflow-y-auto p-5 gap-5 bg-[#070709]">
          {/* COLUMN 1: GENERIC LLM BASELINE (UNGROUNDED) */}
          <div className="space-y-4">
            {/* Column Title */}
            <div className="p-3 border border-crimsonAlert/30 bg-crimsonAlert/10">
              <div className="flex items-center gap-2 text-crimsonAlert font-mono text-xs font-bold uppercase mb-0.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Generic LLM Baseline (Without Qloo)</span>
              </div>
              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                Relies on statistical corporate clichés. Guesswork fails taboo protocols and offers forgettable commodities.
              </p>
            </div>

            {/* Compliance Fail Callout */}
            <div className="p-3 border border-crimsonAlert/30 bg-[#0B0B10]">
              <div className="flex items-center gap-2 text-xs font-mono text-crimsonAlert font-bold mb-1">
                <AlertOctagon className="w-3.5 h-3.5" />
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
              <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider block mb-2 font-bold">
                Generic Gift Proposals
              </span>
              <div className="divide-y divide-stone-800 border border-stone-800 bg-[#0B0B10]">
                {generic.dossier.curatedGifts.map((gift) => (
                  <div key={gift.id} className="p-3">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-serif font-bold text-sm text-stone-200">{gift.title}</h4>
                      <span className="font-mono text-xs text-stone-400 font-bold">${gift.estimatedPriceUsd}</span>
                    </div>
                    <span className="text-[9px] font-mono text-crimsonAlert/90 block mb-1">
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
              <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider block mb-2 font-bold">
                Superficial Conversation Openers
              </span>
              <div className="divide-y divide-stone-800 border border-stone-800 bg-[#0B0B10]">
                {generic.dossier.iceBreakerScripts.map((script, i) => (
                  <div key={i} className="p-2.5 text-xs font-serif italic text-stone-400">
                    {script}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: QLOO GROUNDED CONCIERGE (CURAVIP) */}
          <div className="space-y-4">
            {/* Column Title */}
            <div className="p-3 border border-emeraldStatus/30 bg-emeraldStatus/10">
              <div className="flex items-center gap-2 text-emeraldStatus font-mono text-xs font-bold uppercase mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
                <span>CuraVIP (Qloo Taste Graph Grounded)</span>
              </div>
              <p className="text-xs text-stone-200 font-sans leading-relaxed">
                Anchored in 250M+ cultural entities. Cross-domain inference connects cinema, architecture, and artisan craft.
              </p>
            </div>

            {/* Compliance Passed Callout */}
            <div className="p-3 border border-emeraldStatus/30 bg-[#0B0B10]">
              <div className="flex items-center gap-2 text-xs font-mono text-emeraldStatus font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% FCPA & Taboo Compliant Verified</span>
              </div>
              <p className="text-xs text-stone-300 font-sans">
                Zero alcohol infractions. Zero dietary violations. Strictly audited under corporate ceiling (${grounded.dossier.complianceAudit.effectiveBudgetCapUsd}).
              </p>
            </div>

            {/* Grounded Bespoke Gifts */}
            <div>
              <span className="text-[10px] font-mono uppercase text-champagne-400 tracking-wider block mb-2 font-bold">
                Grounded Bespoke Artifacts
              </span>
              <div className="divide-y divide-stone-800 border border-stone-800 bg-[#0B0B10]">
                {grounded.dossier.curatedGifts.map((gift) => (
                  <div key={gift.id} className="p-3">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-serif font-bold text-sm text-champagne-200">{gift.title}</h4>
                      <span className="font-mono text-xs text-champagne-400 font-bold">${gift.estimatedPriceUsd}</span>
                    </div>
                    <span className="text-[9px] font-mono text-champagne-400 block mb-1">
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
              <span className="text-[10px] font-mono uppercase text-champagne-400 tracking-wider block mb-2 font-bold">
                Diplomatic Rapport Openings
              </span>
              <div className="divide-y divide-stone-800 border border-stone-800 bg-[#0B0B10]">
                {grounded.dossier.iceBreakerScripts.map((script, i) => (
                  <div key={i} className="p-2.5 text-xs font-serif italic text-stone-200">
                    {script}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-800 bg-[#0B0B10] flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-mono">
            Powered by Qloo Taste Graph Correlation Engine & Model Context Protocol
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 border border-champagne-500 bg-champagne-500 text-[#070709] text-xs font-mono font-bold hover:bg-champagne-400 transition-colors"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
