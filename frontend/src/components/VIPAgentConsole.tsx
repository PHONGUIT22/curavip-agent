'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Terminal } from 'lucide-react';
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

  // Default suggested brief when selecting a principal
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
    <section className="border border-stone-800 bg-[#0B0B10] p-5 mb-6">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-champagne-400" />
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-200">
            {selectedVip ? `Briefing Terminal / ${selectedVip.fullName}` : 'Select a VIP Principal'}
          </h2>
        </div>

        {/* Audio Brief Action */}
        {selectedVip && (
          <button
            type="button"
            onClick={handleReadout}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-medium uppercase tracking-wider border transition-colors ${
              isSpeaking
                ? 'bg-champagne-500/20 text-champagne-400 border-champagne-500'
                : 'border-stone-800 bg-[#070709] text-stone-300 hover:text-champagne-400 hover:border-stone-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? 'Speaking' : 'Audio Brief'}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Context Textarea with Dictation */}
        <div className="relative">
          <textarea
            value={meetingBrief}
            onChange={(e) => setMeetingBrief(e.target.value)}
            placeholder="Enter meeting context, deal parameters, or high-stakes hospitality objectives..."
            rows={3}
            className="w-full bg-[#070709] text-stone-200 placeholder-stone-600 text-xs font-sans p-3 pr-10 border border-stone-800 focus:border-champagne-500 focus:outline-none transition-colors resize-none leading-relaxed"
          />

          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`absolute right-2 bottom-2 p-1.5 border transition-colors ${
              isListening
                ? 'bg-crimsonAlert text-white border-crimsonAlert'
                : 'border-stone-800 bg-[#0B0B10] text-stone-400 hover:text-champagne-400'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice dictation'}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Policy Tier Selector & Submit Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Policy Tier Group with 1px Divider */}
          <div className="flex items-center border border-stone-800 bg-[#070709] divide-x divide-stone-800">
            <span className="text-[10px] font-sans font-medium uppercase text-stone-500 px-2.5 py-1">
              Tier:
            </span>

            <button
              type="button"
              onClick={() => onSelectTier('standard_200')}
              className={`px-2.5 py-1 text-xs font-sans font-medium uppercase tracking-wider transition-colors ${
                budgetTier === 'standard_200'
                  ? 'bg-champagne-500/15 text-champagne-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              $200 Std
            </button>

            <button
              type="button"
              onClick={() => onSelectTier('executive_500')}
              className={`px-2.5 py-1 text-xs font-sans font-medium uppercase tracking-wider transition-colors ${
                budgetTier === 'executive_500'
                  ? 'bg-champagne-500/15 text-champagne-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              $500 Exec
            </button>

            <button
              type="button"
              onClick={() => onSelectTier('unlimited_vip')}
              className={`px-2.5 py-1 text-xs font-sans font-medium uppercase tracking-wider transition-colors ${
                budgetTier === 'unlimited_vip'
                  ? 'bg-champagne-500/15 text-champagne-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Unlimited
            </button>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading || !selectedVip}
            className={`flex items-center justify-center gap-2 px-5 py-2 text-xs font-sans uppercase tracking-wider font-semibold transition-colors border ${
              isLoading || !selectedVip
                ? 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
                : 'bg-[#C5A880] text-[#070709] border-[#C5A880] hover:bg-[#D4AF37]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-2 h-2 bg-[#070709] animate-ping" />
                <span>SYNTHESIZING...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {executionMode === 'qloo_grounded' ? 'SYNTHESIZE DOSSIER' : 'RUN GENERIC BASELINE'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
