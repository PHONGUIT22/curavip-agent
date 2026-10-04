'use client';

import React from 'react';

export type GlowState = 'idle' | 'listening' | 'reasoning' | 'complete' | 'error';

interface AmbientGlowProps {
  state?: GlowState;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({ state = 'idle' }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[2px] pointer-events-none z-40 overflow-hidden">
      <div
        className={`w-full h-full transition-colors duration-300 ${
          state === 'error'
            ? 'bg-crimsonAlert'
            : state === 'complete'
            ? 'bg-emeraldStatus'
            : state === 'reasoning'
            ? 'bg-champagne-500 animate-pulse'
            : state === 'listening'
            ? 'bg-champagne-400'
            : 'bg-stone-800'
        }`}
      />
    </div>
  );
};
