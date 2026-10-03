'use client';

import React from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, XCircle, AlertTriangle, Scale } from 'lucide-react';
import type { ComplianceAuditResult } from '../../types';

interface ComplianceAuditCardProps {
  audit: ComplianceAuditResult;
}

export const ComplianceAuditCard: React.FC<ComplianceAuditCardProps> = ({ audit }) => {
  const isCompliant = audit.isCompliant;

  return (
    <div className="luxury-card p-6 border-champagne-500/20 hover:border-champagne-500/40 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-champagne-400 font-bold">
              Governance & Guardrails
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-white/[0.08] uppercase">
              FCPA Audited
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-100">
            Compliance & Taboo Verification
          </h3>
        </div>

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isCompliant
              ? 'bg-emeraldStatus/15 border border-emeraldStatus/30 text-emeraldStatus'
              : 'bg-crimsonAlert/15 border border-crimsonAlert/30 text-crimsonAlert'
          }`}
        >
          {isCompliant ? <ShieldCheck className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
        </div>
      </div>

      {/* Hero Status Banner */}
      <div
        className={`p-4 rounded-xl mb-6 border flex items-center gap-3.5 ${
          isCompliant
            ? 'bg-emeraldStatus/10 border-emeraldStatus/25 text-emeraldStatus'
            : 'bg-crimsonAlert/10 border-crimsonAlert/30 text-crimsonAlert'
        }`}
      >
        {isCompliant ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        ) : (
          <AlertOctagon className="w-5 h-5 flex-shrink-0" />
        )}
        <div>
          <h4 className="font-serif font-bold text-sm tracking-wide">
            {isCompliant
              ? '100% FCPA & Taboo Compliant'
              : 'Compliance Hold Flagged · Governance Review Required'}
          </h4>
          <p className="text-xs text-stone-300 mt-0.5 font-sans leading-relaxed">
            {audit.auditNotes}
          </p>
        </div>
      </div>

      {/* Audit Checklist Table */}
      <div className="space-y-2 mb-6">
        {audit.checks.map((check) => {
          const isPass = check.status === 'pass';
          const isWarn = check.status === 'warn';

          return (
            <div
              key={check.id}
              className="p-3 rounded-lg bg-obsidian-800/80 border border-white/[0.05] flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex-shrink-0">
                  {isPass ? (
                    <CheckCircle2 className="w-4 h-4 text-emeraldStatus" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-4 h-4 text-amberCaution" />
                  ) : (
                    <XCircle className="w-4 h-4 text-crimsonAlert" />
                  )}
                </div>
                <div>
                  <span className="font-medium text-stone-200 block">{check.label}</span>
                  <span className="text-[11px] text-stone-400 font-sans">{check.detail}</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  isPass
                    ? 'bg-emeraldStatus/10 text-emeraldStatus border border-emeraldStatus/20'
                    : isWarn
                    ? 'bg-amberCaution/10 text-amberCaution border border-amberCaution/20'
                    : 'bg-crimsonAlert/10 text-crimsonAlert border border-crimsonAlert/20'
                }`}
              >
                {check.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Blocked Items (if any) */}
      {audit.blockedItems && audit.blockedItems.length > 0 && (
        <div className="p-4 rounded-xl bg-crimsonAlert/5 border border-crimsonAlert/20">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase text-crimsonAlert font-bold">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Blocked Proposals & Intercepted Violations ({audit.blockedItems.length})</span>
          </div>

          <div className="space-y-2">
            {audit.blockedItems.map((item, idx) => (
              <div key={idx} className="text-xs bg-obsidian-900/60 p-2.5 rounded-lg border border-white/[0.05]">
                <div className="font-semibold text-stone-200 mb-1">{item.itemName}</div>
                <div className="text-[11px] text-crimsonAlert font-sans">
                  {item.reasons.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
