'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Compass, Send, CheckCircle2 } from 'lucide-react';
import { speechService } from '../services/speechService';
import type { BudgetTier, ExecutionMode, VIPProfile } from '../types';

interface VIPAgentConsoleProps {
  selectedVip: VIPProfile | null;
  budgetTier: BudgetTier;
  onSelectTier: (tier: BudgetTier) => void;
  executionMode: ExecutionMode;
  onGenerateDossier: (brief: string) => Promise<void>;
  isLoading: boolean;
  onVoiceStateChange?: (isListening: boolean) => void;
}

export const VIPAgentConsole: React.FC<VIPAgentConsoleProps> = ({
  selectedVip,
  budgetTier,
  onSelectTier,
  executionMode,
  onGenerateDossier,
  isLoading,
  onVoiceStateChange,
}) => {
  const [meetingBrief, setMeetingBrief] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Default suggested brief when selecting a new principal
  useEffect(() => {
    if (selectedVip) {
      if (selectedVip.id.includes('marcus')) {
        setMeetingBrief(
          'Private closing dinner for $40M Series B growth round. Exploring strategic co-syndication with Halcyon Ridge.'
        );
      } else if (selectedVip.id.includes('tariq')) {
        setMeetingBrief(
          'Bilateral technology summit dinner in London. Discussing European expansion and enterprise compute partnerships.'
        );
      } else if (selectedVip.id.includes('elena')) {
        setMeetingBrief(
          'Creative brand partnership launch dinner. Presenting multi-city fashion campaign concept.'
        );
      } else {
        setMeetingBrief('');
      }
    }
  }, [selectedVip]);

  // Voice dictation toggle
  const toggleVoiceRecording = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use keyboard input.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      onVoiceStateChange?.(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        speechService.playChime();
        setIsListening(true);
        onVoiceStateChange?.(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMeetingBrief((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsListening(false);
        onVoiceStateChange?.(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        onVoiceStateChange?.(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      onVoiceStateChange?.(false);
    }
  };

  const handleReadout = () => {
    if (!selectedVip) return;
    const textToSpeak = `Briefing initialized for ${selectedVip.fullName}, ${selectedVip.role} at ${selectedVip.organization}. Grounded in Qloo taste graph under corporate tier ${budgetTier}.`;

    if (isSpeaking) {
      speechService.cancel();
      setIsSpeaking(false);
    } else {
      speechService.speak(textToSpeak, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onGenerateDossier(meetingBrief);
  };

  return (
    <section className="luxury-card p-5 md:p-6 mb-8 relative overflow-hidden">
      {/* Background Decorative Crest Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-champagne-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-champagne-500/15 border border-champagne-500/30 flex items-center justify-center">
            <Compass className="w-4 h-4 text-champagne-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-champagne-400 font-semibold block">
              Chief of Staff Console
            </span>
            <h2 className="text-base font-serif font-bold text-stone-100">
              {selectedVip ? `Strategic Briefing · ${selectedVip.fullName}` : 'Select a VIP Principal'}
            </h2>
          </div>
        </div>

        {/* Readout button */}
        {selectedVip && (
          <button
            type="button"
            onClick={handleReadout}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
              isSpeaking
                ? 'bg-champagne-500/20 text-champagne-400 border-champagne-500/40 animate-pulse'
                : 'bg-obsidian-800 text-stone-300 border-white/[0.08] hover:text-champagne-400'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? 'Speaking...' : 'Audio Brief'}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Meeting Briefing Textarea with Dictation Button */}
        <div className="relative">
          <textarea
            value={meetingBrief}
            onChange={(e) => setMeetingBrief(e.target.value)}
            placeholder="Dictate or type meeting context, deal parameters, or high-stakes dinner objectives..."
            rows={3}
            className="w-full bg-obsidian-800/80 text-stone-200 placeholder-stone-500 text-sm rounded-xl p-3.5 pr-12 border border-white/[0.08] focus:border-champagne-500/50 focus:outline-none focus:ring-1 focus:ring-champagne-500/30 transition-all resize-none font-sans"
          />

          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all ${
              isListening
                ? 'bg-crimsonAlert text-white shadow-crimson-glow animate-pulse'
                : 'bg-obsidian-700 text-stone-400 hover:text-champagne-400 hover:bg-obsidian-600'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice dictation'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom controls: Tier Selector + Compose Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Budget Tier Segmented Buttons */}
          <div className="flex items-center gap-1 bg-obsidian-800 p-1 rounded-xl border border-white/[0.06]">
            <span className="text-[11px] font-mono text-stone-400 px-2 uppercase">Policy Tier:</span>

            <button
              type="button"
              onClick={() => onSelectTier('standard_200')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                budgetTier === 'standard_200'
                  ? 'bg-champagne-500/20 text-champagne-400 border border-champagne-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              $200 Standard
            </button>

            <button
              type="button"
              onClick={() => onSelectTier('executive_500')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                budgetTier === 'executive_500'
                  ? 'bg-champagne-500/20 text-champagne-400 border border-champagne-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              $500 Executive
            </button>

            <button
              type="button"
              onClick={() => onSelectTier('unlimited_vip')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                budgetTier === 'unlimited_vip'
                  ? 'bg-champagne-500/20 text-champagne-400 border border-champagne-500/30 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Unlimited VIP
            </button>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading || !selectedVip}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all ${
              isLoading || !selectedVip
                ? 'bg-obsidian-700 text-stone-500 cursor-not-allowed border border-white/[0.05]'
                : 'gold-shimmer-btn shadow-champagne-glow active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Taste Graph...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {executionMode === 'qloo_grounded' ? 'Compose Grounded Dossier' : 'Run Generic Baseline'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
