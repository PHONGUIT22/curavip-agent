'use client';

import React from 'react';

export type GlowState = 'idle' | 'listening' | 'reasoning' | 'complete' | 'error';

interface AmbientGlowProps {
  state?: GlowState;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({ state = 'idle' }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 pointer-events-none z-40 overflow-hidden flex items-end justify-center">
      {/* Background Soft Champagne Wash */}
      <div
        className={`absolute inset-x-0 bottom-0 h-12 transition-opacity duration-700 ${
          state === 'error'
            ? 'bg-gradient-to-t from-crimsonAlert/30 to-transparent'
            : state === 'complete'
            ? 'bg-gradient-to-t from-emeraldStatus/25 to-transparent'
            : state === 'reasoning'
            ? 'bg-gradient-to-t from-champagne-500/35 to-transparent animate-pulse'
            : state === 'listening'
            ? 'bg-gradient-to-t from-champagne-400/40 to-transparent'
            : 'bg-gradient-to-t from-champagne-500/10 to-transparent'
        }`}
      />

      {/* Central Concentrated Photon Strip */}
      <div
        className={`w-3/5 max-w-2xl h-[2px] rounded-full transition-all duration-500 ${
          state === 'error'
            ? 'bg-crimsonAlert shadow-crimson-glow'
            : state === 'complete'
            ? 'bg-emeraldStatus shadow-emerald-glow'
            : state === 'reasoning'
            ? 'bg-gradient-to-r from-champagne-600 via-champagne-400 to-champagne-600 shadow-champagne-glow-lg animate-champagne-pulse'
            : state === 'listening'
            ? 'bg-champagne-400 shadow-champagne-glow scale-x-110'
            : 'bg-champagne-500/40 shadow-luxury-glow scale-x-90 opacity-60'
        }`}
      />
    </div>
  );
};
