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
    <div className="border border-[#E5E0D6] bg-white rounded-sm p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#EBE6DD]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#183D33]">
              Governance & Guardrails
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 border border-[#E5E0D6] bg-[#FAF8F5] text-[#6B736D] rounded-sm uppercase tracking-wide">
              FCPA Audited
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-[#161A18] tracking-tight">
            Compliance & Taboo Verification Ledger
          </h3>
        </div>

        <div
          className={`w-9 h-9 border rounded-sm flex items-center justify-center ${
            isCompliant
              ? 'border-[#C8DCD1] bg-[#EDF4F0] text-[#1D5A4A]'
              : 'border-[#F8B4B4] bg-[#FDF2F2] text-[#C53030]'
          }`}
        >
          {isCompliant ? <ShieldCheck className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
        </div>
      </div>

      {/* Hero Status Banner */}
      <div
        className={`p-4 mb-5 border rounded-sm flex items-start gap-3.5 ${
          isCompliant
            ? 'border-[#C8DCD1] bg-[#EDF4F0] text-[#1D5A4A]'
            : 'border-[#F8B4B4] bg-[#FDF2F2] text-[#C53030]'
        }`}
      >
        {isCompliant ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <h4 className="font-sans text-sm font-semibold uppercase tracking-wider">
            {isCompliant
              ? '100% FCPA & Taboo Compliant'
              : 'Compliance Hold Flagged / Governance Review Required'}
          </h4>
          <p className="text-sm text-[#323835] mt-1 font-sans leading-relaxed">
            {audit.auditNotes}
          </p>
        </div>
      </div>

      {/* Audit Checklist Table with 1px Hairline Dividers */}
      <div className="divide-y divide-[#EBE6DD] border border-[#E5E0D6] bg-[#FAF8F5] rounded-sm mb-5">
        {audit.checks.map((check) => {
          const isPass = check.status === 'pass';
          const isWarn = check.status === 'warn';

          return (
            <div
              key={check.id}
              className="p-3.5 flex items-start justify-between gap-3 text-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {isPass ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-4 h-4 text-[#B45309]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#C53030]" />
                  )}
                </div>
                <div>
                  <span className="font-semibold text-[#161A18] block">{check.label}</span>
                  <span className="text-xs text-[#6B736D] font-sans">{check.detail}</span>
                </div>
              </div>

              <span
                className={`text-xs font-semibold uppercase px-2 py-0.5 border rounded-sm flex-shrink-0 ${
                  isPass
                    ? 'border-[#C8DCD1] bg-[#EDF4F0] text-[#1D5A4A]'
                    : isWarn
                    ? 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]'
                    : 'border-[#F8B4B4] bg-[#FDF2F2] text-[#C53030]'
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
        <div className="p-4 border border-[#F8B4B4] bg-[#FDF2F2] rounded-sm">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold uppercase text-[#C53030]">
            <AlertOctagon className="w-4 h-4" />
            <span>Blocked Proposals & Intercepted Violations ({audit.blockedItems.length})</span>
          </div>

          <div className="space-y-2">
            {audit.blockedItems.map((item, idx) => (
              <div key={idx} className="text-sm p-3 border border-[#E5E0D6] bg-white rounded-sm shadow-sm">
                <div className="font-semibold text-[#161A18] mb-1">{item.itemName}</div>
                <div className="text-xs text-[#C53030] font-sans font-medium">
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
