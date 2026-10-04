'use client';

import React, { useState } from 'react';
import { X, UserPlus, Compass, Plus, Check } from 'lucide-react';
import type { VIPProfileInput } from '../types';

interface CreateVipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newVip: VIPProfileInput) => Promise<void>;
  isLoading?: boolean;
}

const SUGGESTED_PASSIONS = [
  'Jazz',
  'Vinyl records',
  'Scandinavian design',
  'Specialty Espresso',
  'Modernist architecture',
  'Mechanical watches',
  'Contemporary art',
  'Natural wine',
  'Japanese ceramics',
  'Rare books',
];

export const CreateVipModal: React.FC<CreateVipModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [city, setCity] = useState('');
  const [budgetTierChoice, setBudgetTierChoice] = useState<'200' | '500' | '1500' | 'custom'>('500');
  const [customBudget, setCustomBudget] = useState('750');
  const [passions, setPassions] = useState<string[]>(['Specialty Espresso', 'Scandinavian design']);
  const [newPassionInput, setNewPassionInput] = useState('');
  const [noAlcohol, setNoAlcohol] = useState(false);
  const [dietaryTaboos, setDietaryTaboos] = useState<string[]>([]);
  const [rawBio, setRawBio] = useState('');

  if (!isOpen) return null;

  const handleAddPassion = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !passions.includes(trimmed)) {
      setPassions((prev) => [...prev, trimmed]);
    }
    setNewPassionInput('');
  };

  const handleRemovePassion = (tag: string) => {
    setPassions((prev) => prev.filter((p) => p !== tag));
  };

  const toggleDietary = (taboo: string) => {
    setDietaryTaboos((prev) =>
      prev.includes(taboo) ? prev.filter((t) => t !== taboo) : [...prev, taboo]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || isLoading) return;

    const budgetLimitUsd =
      budgetTierChoice === '200'
        ? 200
        : budgetTierChoice === '500'
          ? 500
          : budgetTierChoice === '1500'
            ? 1500
            : parseInt(customBudget, 10) || 500;

    const newProfile: VIPProfileInput = {
      fullName: fullName.trim(),
      role: role.trim() || 'Principal & Executive',
      organization: organization.trim() || 'Global Enterprise',
      city: city.trim() || 'New York',
      budgetLimitUsd,
      rawBio:
        rawBio.trim() ||
        `${fullName.trim()} is a distinguished principal based in ${city || 'the city'}, passionate about ${passions.join(', ') || 'bespoke cultural artifacts'}.`,
      explicitInterests: passions.length > 0 ? passions : ['Artisanal Craft', 'Minimalist Design'],
      taboos: {
        alcohol: noAlcohol,
        dietary: dietaryTaboos,
        religiousCultural: noAlcohol ? ['No alcohol or barware'] : [],
      },
    };

    await onSubmit(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FAF8F5] border border-[#E5E0D6]/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE6DD] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#183D33]/10 flex items-center justify-center text-[#183D33]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#161A18]">
                Custom VIP Profile Builder
              </h3>
              <p className="text-xs text-[#6B736D]">
                Test live Qloo grounding with your personal identity or customized principal specs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B736D] hover:text-[#161A18] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Principal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#323835] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mike Diolosa"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5E0D6] rounded-lg focus:border-[#183D33] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#323835] mb-1.5">
                Executive Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. CTO & Head of Product"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5E0D6] rounded-lg focus:border-[#183D33] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#323835] mb-1.5">
                Organization
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Qloo / Strategic Partner"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5E0D6] rounded-lg focus:border-[#183D33] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#323835] mb-1.5">
                Primary City / Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New York, London, Tokyo, Riyadh"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5E0D6] rounded-lg focus:border-[#183D33] focus:outline-none"
              />
            </div>
          </div>

          {/* Cultural Passions & Seeds */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#323835] mb-1.5">
              Explicit Cultural Passions (Tags / Taste Seeds)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPassionInput}
                onChange={(e) => setNewPassionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPassion(newPassionInput);
                  }
                }}
                placeholder="Type a passion (e.g. Scandinavian design) and press Enter"
                className="flex-1 px-3.5 py-2 text-sm bg-white border border-[#E5E0D6] rounded-lg focus:border-[#183D33] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddPassion(newPassionInput)}
                className="px-3.5 py-2 text-xs font-semibold uppercase bg-[#FAF8F5] border border-[#E5E0D6] text-[#183D33] hover:bg-white rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {/* Active Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[28px]">
              {passions.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-white border border-[#183D33]/30 text-[#183D33] rounded-full shadow-2xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemovePassion(tag)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] text-[#8C938E] self-center mr-1">Suggestions:</span>
              {SUGGESTED_PASSIONS.filter((s) => !passions.includes(s)).slice(0, 6).map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => handleAddPassion(suggested)}
                  className="text-[11px] px-2.5 py-0.5 border border-dashed border-[#C8DCD1] text-[#1D5A4A] hover:bg-[#EDF4F0] rounded-full transition-colors"
                >
                  + {suggested}
                </button>
              ))}
            </div>
          </div>

          {/* Religious & Dietary Taboos */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#323835] mb-2">
              Ethical, Religious & Dietary Taboos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <label className="flex items-center gap-2 p-2.5 bg-white border border-[#E5E0D6] rounded-lg cursor-pointer hover:border-[#183D33] transition-colors">
                <input
                  type="checkbox"
                  checked={noAlcohol}
                  onChange={(e) => setNoAlcohol(e.target.checked)}
                  className="rounded text-[#183D33] focus:ring-[#183D33]"
                />
                <span className="text-xs font-medium text-[#161A18]">No Alcohol (Strict)</span>
              </label>

              {['halal', 'kosher', 'shellfish', 'vegan', 'gluten-free'].map((taboo) => (
                <label
                  key={taboo}
                  className="flex items-center gap-2 p-2.5 bg-white border border-[#E5E0D6] rounded-lg cursor-pointer hover:border-[#183D33] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={dietaryTaboos.includes(taboo)}
                    onChange={() => toggleDietary(taboo)}
                    className="rounded text-[#183D33] focus:ring-[#183D33]"
                  />
                  <span className="text-xs font-medium text-[#161A18] capitalize">
                    {taboo === 'shellfish' ? 'Shellfish Allergy' : taboo}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Corporate Policy Limit */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#323835] mb-2">
              Corporate Gifting Policy Ceiling
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '200', label: '$200 Std' },
                { id: '500', label: '$500 Exec' },
                { id: '1500', label: '$1,500 VIP' },
                { id: 'custom', label: 'Custom' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBudgetTierChoice(opt.id as any)}
                  className={`py-2 text-xs font-semibold uppercase tracking-wider border rounded-lg transition-all ${
                    budgetTierChoice === opt.id
                      ? 'bg-[#183D33] text-white border-[#183D33]'
                      : 'bg-white text-[#6B736D] border-[#E5E0D6] hover:border-[#183D33]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {budgetTierChoice === 'custom' && (
              <div className="mt-2.5">
                <input
                  type="number"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="Enter custom budget cap in USD"
                  min="50"
                  max="10000"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5E0D6] rounded-lg focus:border-[#183D33] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Bio / Strategic Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#323835] mb-1.5">
              Personal Bio / Sensibility Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={rawBio}
              onChange={(e) => setRawBio(e.target.value)}
              placeholder="Notable personality traits, aesthetics, or communication style..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5E0D6] rounded-lg focus:border-[#183D33] focus:outline-none resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EBE6DD]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#6B736D] hover:text-[#161A18] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !fullName.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white rounded-lg shadow-sm transition-all ${
                isLoading || !fullName.trim()
                  ? 'bg-[#8C938E] cursor-not-allowed'
                  : 'bg-[#183D33] hover:bg-[#224F43]'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                  <span>CREATING & GROUNDING...</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" />
                  <span>Save & Generate Cultural Dossier</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
