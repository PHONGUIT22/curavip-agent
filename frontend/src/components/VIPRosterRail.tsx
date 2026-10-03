'use client';

import React from 'react';
import { User, ShieldAlert, Award, MapPin } from 'lucide-react';
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
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="luxury-card p-5 mb-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-champagne-400" />
            <h3 className="font-serif font-bold text-sm text-stone-100">
              VIP Principals Roster
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-champagne-500/10 text-champagne-400 border border-champagne-500/20 font-semibold">
            {profiles.length} Active
          </span>
        </div>

        <div className="space-y-3">
          {profiles.map((vip) => {
            const isSelected = vip.id === selectedVipId;
            const hasTaboos = vip.taboos.alcohol || (vip.taboos.dietary && vip.taboos.dietary.length > 0);

            return (
              <div
                key={vip.id}
                onClick={() => onSelectVip(vip)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'luxury-card-selected bg-obsidian-800'
                    : 'bg-obsidian-850/60 border-white/[0.06] hover:border-champagne-500/30 hover:bg-obsidian-800/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-serif font-bold text-sm text-stone-100">
                    {vip.fullName}
                  </h4>
                  <span className="font-mono text-xs text-champagne-400 font-bold">
                    ${vip.budgetLimitUsd}
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 font-sans mb-2">
                  {vip.role} · {vip.organization}
                </p>

                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-stone-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-500" />
                    <span>{vip.city}</span>
                  </div>

                  {hasTaboos && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amberCaution/10 text-amberCaution border border-amberCaution/20 flex items-center gap-1">
                      <ShieldAlert className="w-2.5 h-2.5" />
                      <span>Taboo Guard</span>
                    </span>
                  )}
                </div>

                {/* Explicit Interests Preview */}
                <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex flex-wrap gap-1">
                  {vip.explicitInterests.slice(0, 3).map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-2 py-0.5 rounded bg-obsidian-900 text-stone-300 border border-white/[0.05]"
                    >
                      {interest}
                    </span>
                  ))}
                  {vip.explicitInterests.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-obsidian-900 text-stone-500">
                      +{vip.explicitInterests.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
