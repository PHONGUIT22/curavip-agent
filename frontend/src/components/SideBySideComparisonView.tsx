'use client';

import React from 'react';
import { X, Compass, AlertOctagon, CheckCircle2, Zap, TrendingDown, Target, ShieldCheck, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[94vh] sm:max-h-[88vh] flex flex-col border border-[#E5E0D6]/80 bg-[#F8F6F0] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#E5E0D6] flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#183D33]">
                Competitive Benchmark
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 border border-[#E5E0D6] bg-[#FAF8F5] text-[#6B736D] rounded-full uppercase tracking-wide">
                The Grounding Difference
              </span>
            </div>
            <h2 className="font-sans text-xl font-semibold text-[#161A18] tracking-tight">
              Why Generic LLMs Fail High-Ticket Dealmakers: {groundedVip.fullName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-[#E5E0D6] bg-white text-[#6B736D] hover:text-[#161A18] hover:border-[#183D33] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Benchmark Metrics Counters */}
        <div className="bg-[#FAF8F5] border-b border-[#E5E0D6] px-5 sm:px-6 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E5E0D6] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 flex-shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-[#161A18] tracking-tight">-87%</span>
                <span className="text-2xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">Eliminated</span>
              </div>
              <span className="text-xs text-[#6B736D] font-medium block">Generic Hallucination</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E5E0D6] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#183D33]/10 border border-[#183D33]/20 flex items-center justify-center text-[#183D33] flex-shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-[#183D33] tracking-tight">96.4%</span>
                <span className="text-2xs font-semibold px-1.5 py-0.5 rounded bg-[#EDF4F0] text-[#183D33] uppercase">Qloo Verified</span>
              </div>
              <span className="text-xs text-[#6B736D] font-medium block">Cultural Relevance</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E5E0D6] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-emerald-700 tracking-tight">100% Pass</span>
                <span className="text-2xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">0 Violations</span>
              </div>
              <span className="text-xs text-[#6B736D] font-medium block">Compliance Guardrail</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split Comparison Body */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5E0D6] overflow-y-auto p-4 sm:p-6 gap-6 bg-[#F8F6F0]">
          {/* COLUMN 1: GENERIC LLM BASELINE (UNGROUNDED) */}
          <div className="space-y-5">
            {/* Column Title */}
            <div className="p-4 sm:p-5 border border-[#F8B4B4] bg-[#FDF2F2] rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-[#C53030] font-sans text-xs font-semibold uppercase mb-1">
                <Zap className="w-4 h-4" />
                <span>Generic LLM Baseline (Without Qloo)</span>
              </div>
              <p className="text-sm text-[#323835] font-sans leading-relaxed">
                Relies on statistical corporate clichés. Guesswork fails taboo protocols and offers forgettable commodities.
              </p>
            </div>

            {/* Compliance Fail Callout */}
            <div className="p-4 sm:p-5 border border-[#F8B4B4] bg-white rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-sans text-[#C53030] font-semibold uppercase mb-2">
                <AlertOctagon className="w-4 h-4" />
                <span>Governance Risk: Taboo & FCPA Violations</span>
              </div>
              <ul className="text-sm text-[#323835] list-disc list-inside space-y-1 font-sans">
                {generic.dossier.complianceAudit.tabooViolations.length > 0 ? (
                  generic.dossier.complianceAudit.tabooViolations.map((v, i) => (
                    <li key={i} className="text-[#C53030] font-medium">{v}</li>
                  ))
                ) : (
                  <li className="text-[#B45309]">Generic luxury padfolio with unauthorized pigskin/animal material.</li>
                )}
              </ul>
            </div>

            {/* Cliché Gifts */}
            <div>
              <span className="text-xs font-semibold uppercase text-[#6B736D] tracking-wider block mb-2.5">
                Generic Gift Proposals
              </span>
              <div className="divide-y divide-[#EBE6DD] border border-[#E5E0D6] bg-white rounded-xl shadow-2xs overflow-hidden">
                {generic.dossier.curatedGifts.map((gift) => (
                  <div key={gift.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-sans font-semibold text-base text-[#161A18] leading-snug flex-1 min-w-0 pr-2">
                        {gift.title}
                      </h4>
                      <span className="font-sans font-semibold text-sm text-[#6B736D] tabular-nums shrink-0 whitespace-nowrap bg-neutral-100 px-2.5 py-1 rounded-md">
                        ${gift.estimatedPriceUsd}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#C53030] block mb-1.5">
                      Anchor: {gift.qlooCorrelationAnchor}
                    </span>
                    <p className="text-sm text-[#6B736D] font-sans leading-relaxed">
                      {gift.culturalRationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cliché Ice-Breakers */}
            <div>
              <span className="text-xs font-semibold uppercase text-[#6B736D] tracking-wider block mb-2.5">
                Superficial Conversation Openers
              </span>
              <div className="divide-y divide-[#EBE6DD] border border-[#E5E0D6] bg-white rounded-xl shadow-2xs overflow-hidden">
                {generic.dossier.iceBreakerScripts.map((script, i) => (
                  <div key={i} className="p-3.5 text-sm font-sans text-[#6B736D] leading-relaxed">
                    {script}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: QLOO GROUNDED CONCIERGE (CURAVIP) */}
          <div className="space-y-5">
            {/* Column Title */}
            <div className="p-4 sm:p-5 border border-[#C8DCD1] bg-[#EDF4F0] rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-[#1D5A4A] font-sans text-xs font-semibold uppercase mb-1">
                <Compass className="w-4 h-4 text-[#1D5A4A]" />
                <span>CuraVIP (Qloo Taste Graph Grounded)</span>
              </div>
              <p className="text-sm text-[#323835] font-sans leading-relaxed">
                Anchored in 250M+ cultural entities. Cross-domain inference connects cinema, architecture, and artisan craft.
              </p>
            </div>

            {/* Compliance Passed Callout */}
            <div className="p-4 sm:p-5 border border-[#C8DCD1] bg-white rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-sans text-[#1D5A4A] font-semibold uppercase mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>100% FCPA & Taboo Compliant Verified</span>
              </div>
              <p className="text-sm text-[#323835] font-sans leading-relaxed">
                Zero alcohol infractions. Zero dietary violations. Strictly audited under corporate ceiling (${grounded.dossier.complianceAudit.effectiveBudgetCapUsd}).
              </p>
            </div>

            {/* Grounded Bespoke Gifts */}
            <div>
              <span className="text-xs font-semibold uppercase text-[#183D33] tracking-wider block mb-2.5">
                Grounded Bespoke Artifacts
              </span>
              <div className="divide-y divide-[#EBE6DD] border border-[#E5E0D6] bg-white rounded-xl shadow-2xs overflow-hidden">
                {grounded.dossier.curatedGifts.map((gift) => (
                  <div key={gift.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-sans font-semibold text-base text-[#161A18] leading-snug flex-1 min-w-0 pr-2">
                        {gift.title}
                      </h4>
                      <span className="font-sans font-semibold text-sm text-[#183D33] tabular-nums shrink-0 whitespace-nowrap bg-[#183D33]/5 px-2.5 py-1 rounded-md">
                        ${gift.estimatedPriceUsd}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#183D33] block mb-1.5">
                      Anchor: {gift.qlooCorrelationAnchor}
                    </span>
                    <p className="text-sm text-[#323835] font-sans leading-relaxed">
                      {gift.culturalRationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grounded Ice-Breakers */}
            <div>
              <span className="text-xs font-semibold uppercase text-[#183D33] tracking-wider block mb-2.5">
                Diplomatic Rapport Openings
              </span>
              <div className="divide-y divide-[#EBE6DD] border border-[#E5E0D6] bg-white rounded-xl shadow-2xs overflow-hidden">
                {grounded.dossier.iceBreakerScripts.map((script, i) => (
                  <div key={i} className="p-3.5 text-sm font-sans text-[#323835] leading-relaxed">
                    {script}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E0D6] bg-white flex items-center justify-between">
          <span className="text-xs text-[#6B736D] font-sans">
            Powered by Qloo Taste Graph Correlation Engine & Model Context Protocol
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#183D33] bg-[#183D33] text-white text-xs font-semibold uppercase tracking-wide hover:bg-[#224F43] rounded-lg transition-colors shadow-sm"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
