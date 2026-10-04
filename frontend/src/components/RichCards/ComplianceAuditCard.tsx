'use client';

import React from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { ComplianceAuditResult } from '../../types';

interface ComplianceAuditCardProps {
  audit: ComplianceAuditResult;
}

export const ComplianceAuditCard: React.FC<ComplianceAuditCardProps> = ({ audit }) => {
  const isCompliant = audit.isCompliant;

  return (
    <div className="border border-stone-800 bg-[#0B0B10] p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-3 mb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-champagne-400">
              Governance & Guardrails
            </span>
            <span className="text-[9px] font-sans font-medium px-1.5 py-0.5 border border-stone-800 bg-[#070709] text-stone-300 uppercase">
              FCPA Audited
            </span>
          </div>
          <h3 className="text-xl font-medium text-white tracking-tight">
            Compliance & Taboo Verification Ledger
          </h3>
        </div>

        <div
          className={`w-8 h-8 border flex items-center justify-center ${
            isCompliant
              ? 'border-emeraldStatus/40 bg-emeraldStatus/10 text-emeraldStatus'
              : 'border-crimsonAlert/40 bg-crimsonAlert/10 text-crimsonAlert'
          }`}
        >
          {isCompliant ? <ShieldCheck className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
        </div>
      </div>

      {/* Hero Status Banner */}
      <div
        className={`p-3.5 mb-4 border flex items-center gap-3 ${
          isCompliant
            ? 'border-emeraldStatus/30 bg-emeraldStatus/10 text-emeraldStatus'
            : 'border-crimsonAlert/30 bg-crimsonAlert/10 text-crimsonAlert'
        }`}
      >
        {isCompliant ? (
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        ) : (
          <AlertOctagon className="w-4 h-4 flex-shrink-0" />
        )}
        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-wider">
            {isCompliant
              ? '100% FCPA & Taboo Compliant'
              : 'Compliance Hold Flagged / Governance Review Required'}
          </h4>
          <p className="text-xs text-stone-300 mt-0.5 font-sans leading-relaxed">
            {audit.auditNotes}
          </p>
        </div>
      </div>

      {/* Audit Checklist Table with 1px Hairline Dividers */}
      <div className="divide-y divide-stone-800 border border-stone-800 bg-[#070709] mb-4">
        {audit.checks.map((check) => {
          const isPass = check.status === 'pass';
          const isWarn = check.status === 'warn';

          return (
            <div
              key={check.id}
              className="p-3 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex-shrink-0">
                  {isPass ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emeraldStatus" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amberCaution" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-crimsonAlert" />
                  )}
                </div>
                <div>
                  <span className="font-medium text-stone-200 block">{check.label}</span>
                  <span className="text-[11px] text-stone-400 font-sans">{check.detail}</span>
                </div>
              </div>

              <span
                className={`text-[9px] font-sans font-semibold uppercase px-1.5 py-0.5 border flex-shrink-0 ${
                  isPass
                    ? 'border-emeraldStatus/30 bg-emeraldStatus/10 text-emeraldStatus'
                    : isWarn
                    ? 'border-amberCaution/30 bg-amberCaution/10 text-amberCaution'
                    : 'border-crimsonAlert/30 bg-crimsonAlert/10 text-crimsonAlert'
                }`}
              >
                [{check.status}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Blocked Items (if any) */}
      {audit.blockedItems && audit.blockedItems.length > 0 && (
        <div className="p-3 border border-crimsonAlert/30 bg-crimsonAlert/5">
          <div className="flex items-center gap-2 mb-2 text-xs font-sans font-semibold uppercase text-crimsonAlert">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Blocked Proposals & Intercepted Violations ({audit.blockedItems.length})</span>
          </div>

          <div className="space-y-1.5">
            {audit.blockedItems.map((item, idx) => (
              <div key={idx} className="text-xs p-2 border border-stone-800 bg-[#070709]">
                <div className="font-semibold text-stone-200 mb-0.5">{item.itemName}</div>
                <div className="text-[11px] text-crimsonAlert font-sans">
                  {item.reasons.join(' / ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
