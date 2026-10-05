'use client';

import React, { useState } from 'react';
import { Activity, CheckCircle2, Database, Globe, Network, ShieldCheck, Zap } from 'lucide-react';
import { soundService } from '../services/soundService';

interface QlooTelemetryBadgeProps {
  isLive?: boolean;
}

export const QlooTelemetryBadge: React.FC<QlooTelemetryBadgeProps> = ({ isLive = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block select-none">
      {/* Interactive Telemetry Trigger Pill */}
      <button
        type="button"
        onClick={() => {
          soundService.playMechanicalClick();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => soundService.playMechanicalClick()}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C8DCD1] bg-[#EDF4F0] hover:bg-[#E3EEE8] hover:border-[#1D5A4A]/40 transition-all text-xs text-[#1D5A4A] shadow-2xs group cursor-pointer"
        title="Click to view live Qloo Taste Graph telemetry"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
        </span>

        <span className="font-semibold tracking-wide">
          Qloo Taste Graph: <span className="font-normal text-emerald-800">Connected</span>
        </span>

        <span className="hidden md:inline text-[#2D7360] font-mono text-2xs bg-white/70 px-1.5 py-0.5 rounded border border-[#C8DCD1]">
          v2/insights
        </span>

        <span className="hidden lg:inline text-[#6B736D] text-2xs border-l border-[#C8DCD1] pl-2 font-mono">
          14ms · 250M+
        </span>
      </button>

      {/* Floating Detailed Telemetry Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#183D33]/20 rounded-2xl shadow-2xl p-5 z-50 animate-fade-in text-[#161A18]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EBE6DD]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#183D33]/10 flex items-center justify-center text-[#183D33]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#183D33]">
                    Qloo Taste Graph Telemetry
                  </h4>
                  <p className="text-2xs text-[#6B736D]">Real-Time Cultural Intelligence Pipeline</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-3xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {isLive ? 'Live API Connected' : 'High-Fidelity Vault'}
              </span>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD]">
                <div className="text-3xs uppercase tracking-wider text-[#6B736D] font-semibold mb-0.5">
                  Pipeline Latency
                </div>
                <div className="text-base font-serif font-bold text-[#183D33]">
                  14ms <span className="text-3xs font-sans font-normal text-[#6B736D]">(p99: 22ms)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD]">
                <div className="text-3xs uppercase tracking-wider text-[#6B736D] font-semibold mb-0.5">
                  Cached Entities
                </div>
                <div className="text-base font-serif font-bold text-[#183D33]">
                  250M+ <span className="text-3xs font-sans font-normal text-[#6B736D]">Vectors</span>
                </div>
              </div>
            </div>

            {/* Active Endpoints Pipeline */}
            <div className="space-y-2 mb-3.5">
              <div className="text-2xs font-semibold uppercase tracking-wider text-[#6B736D]">
                Active Qloo Endpoints Handled
              </div>
              <div className="space-y-1.5 font-mono text-2xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F6F0] border border-[#E5E0D6]">
                  <div className="flex items-center gap-1.5 text-[#183D33]">
                    <span className="font-bold text-emerald-700">GET</span>
                    <span>/v2/insights</span>
                  </div>
                  <span className="text-3xs text-[#6B736D]">Cross-Domain Seeds</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F6F0] border border-[#E5E0D6]">
                  <div className="flex items-center gap-1.5 text-[#183D33]">
                    <span className="font-bold text-amber-700">POST</span>
                    <span>/v2/correlate</span>
                  </div>
                  <span className="text-3xs text-[#6B736D]">Latent Similarity (0.94+)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F6F0] border border-[#E5E0D6]">
                  <div className="flex items-center gap-1.5 text-[#183D33]">
                    <span className="font-bold text-blue-700">GET</span>
                    <span>/v2/media</span>
                  </div>
                  <span className="text-3xs text-[#6B736D]">Cultural Entity Metadata</span>
                </div>
              </div>
            </div>

            {/* Footer Footprint */}
            <div className="pt-2.5 border-t border-[#EBE6DD] flex items-center justify-between text-3xs text-[#6B736D]">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-[#183D33]" />
                Zero-Data-Drift Protocol
              </span>
              <span className="font-mono text-[#183D33]">v2.14-prod</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
