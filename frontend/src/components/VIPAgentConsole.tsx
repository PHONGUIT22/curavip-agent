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
    <section className="border border-[#E5E0D6] bg-white rounded-sm p-6 shadow-sm mb-6">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#EBE6DD]">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#183D33]" />
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#161A18]">
            {selectedVip ? `Briefing Terminal / ${selectedVip.fullName}` : 'Select a VIP Principal'}
          </h2>
        </div>

        {/* Audio Brief Action */}
        {selectedVip && (
          <button
            type="button"
            onClick={handleReadout}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border rounded-sm transition-colors ${
              isSpeaking
                ? 'bg-[#EDF4F0] text-[#1D5A4A] border-[#C8DCD1]'
                : 'border-[#E5E0D6] bg-[#FAF8F5] text-[#323835] hover:border-[#183D33] hover:text-[#183D33]'
            }`}
          >
            <Volume2 className="w-4 h-4 text-[#183D33]" />
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
            className="w-full bg-[#FAF8F5] text-[#161A18] placeholder-[#8C938E] text-sm p-3.5 pr-12 border border-[#E5E0D6] focus:border-[#183D33] focus:bg-white focus:outline-none transition-colors rounded-sm resize-none leading-relaxed"
          />

          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`absolute right-3 bottom-3 p-1.5 border rounded-sm transition-colors ${
              isListening
                ? 'bg-[#C53030] text-white border-[#C53030]'
                : 'border-[#E5E0D6] bg-white text-[#6B736D] hover:text-[#183D33] hover:border-[#183D33]'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice dictation'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Policy Tier Selector & Submit Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Policy Tier Group with 1px Divider */}
          <div className="flex items-center border border-[#E5E0D6] bg-[#FAF8F5] rounded-sm divide-x divide-[#E5E0D6]">
            <span className="text-xs font-semibold uppercase text-[#6B736D] px-3.5 py-2">
              Tier:
            </span>

            <button
              type="button"
              onClick={() => onSelectTier('standard_200')}
              className={`px-3.5 py-2 text-xs uppercase tracking-wide transition-all ${
                budgetTier === 'standard_200'
                  ? 'bg-[#183D33] text-white font-semibold shadow-sm'
                  : 'text-[#6B736D] hover:text-[#161A18] font-medium'
              }`}
            >
              $200 Std
            </button>

            <button
              type="button"
              onClick={() => onSelectTier('executive_500')}
              className={`px-3.5 py-2 text-xs uppercase tracking-wide transition-all ${
                budgetTier === 'executive_500'
                  ? 'bg-[#183D33] text-white font-semibold shadow-sm'
                  : 'text-[#6B736D] hover:text-[#161A18] font-medium'
              }`}
            >
              $500 Exec
            </button>

            <button
              type="button"
              onClick={() => onSelectTier('unlimited_vip')}
              className={`px-3.5 py-2 text-xs uppercase tracking-wide transition-all ${
                budgetTier === 'unlimited_vip'
                  ? 'bg-[#183D33] text-white font-semibold shadow-sm'
                  : 'text-[#6B736D] hover:text-[#161A18] font-medium'
              }`}
            >
              Unlimited
            </button>
          </div>

          {/* Submit Action Button (Deep Pine Green Solid button) */}
          <button
            type="submit"
            disabled={isLoading || !selectedVip}
            className={`flex items-center justify-center gap-2.5 px-6 py-2.5 text-sm uppercase tracking-wider font-semibold transition-all rounded-sm shadow-sm ${
              isLoading || !selectedVip
                ? 'bg-[#EBE6DD] text-[#8C938E] border border-[#E5E0D6] cursor-not-allowed'
                : 'bg-[#183D33] hover:bg-[#224F43] text-white border border-[#183D33]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                <span>SYNTHESIZING...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
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
