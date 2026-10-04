'use client';

import React from 'react';
import { User, ShieldAlert, MapPin } from 'lucide-react';
import type { VIPProfile } from '../types';

interface VIPRosterRailProps {
  profiles: VIPProfile[];
  selectedVipId: string | null;
  onSelectVip: (profile: VIPProfile) => void;
}

export const VIPRosterRail: React.FC<VIPRosterRailProps> = ({
  profiles,
  selectedVipId,
  onSelectVip,
}) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="border border-stone-800 bg-[#0B0B10]">
        {/* Terminal Section Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 bg-[#070709]">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-champagne-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-200">
              Principal Roster
            </h3>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 border border-stone-800 text-stone-400">
            {profiles.length} Active
          </span>
        </div>

        {/* Directory List with 1px Hairline Dividers */}
        <div className="divide-y divide-stone-800">
          {profiles.map((vip) => {
            const isSelected = vip.id === selectedVipId;
            const hasTaboos = vip.taboos.alcohol || (vip.taboos.dietary && vip.taboos.dietary.length > 0);

            return (
              <button
                key={vip.id}
                type="button"
                onClick={() => onSelectVip(vip)}
                className={`w-full text-left p-4 transition-colors ${
                  isSelected
                    ? 'bg-[#12121A] border-l-2 border-l-champagne-500'
                    : 'bg-[#0B0B10] hover:bg-[#0E0E16]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-sans text-sm font-semibold text-stone-100 tracking-tight">
                    {vip.fullName}
                  </h4>
                  <span className="font-mono tabular-nums text-xs text-champagne-400 font-medium">
                    ${vip.budgetLimitUsd}
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 font-sans mb-2">
                  {vip.role} / {vip.organization}
                </p>

                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-stone-400 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-500" />
                    <span>{vip.city}</span>
                  </div>

                  {hasTaboos && (
                    <span className="text-[9px] px-1 py-0.2 border border-amberCaution/30 text-amberCaution uppercase">
                      Taboo Guard
                    </span>
                  )}
                </div>

                {/* Explicit Interests Ledger Tags */}
                <div className="flex flex-wrap gap-1">
                  {vip.explicitInterests.slice(0, 3).map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-stone-800 bg-[#070709] text-stone-300"
                    >
                      {interest}
                    </span>
                  ))}
                  {vip.explicitInterests.length > 3 && (
                    <span className="text-[9px] font-mono px-1 py-0.5 text-stone-500">
                      +{vip.explicitInterests.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
