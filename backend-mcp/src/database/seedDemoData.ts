import { vipDossierRepo } from './vipDossierRepo.js';
import type { VIPProfileInput } from '../types/index.js';

/**
 * Three reference principals used for the live demo.
 * Each one is designed to exercise a different part of the agent:
 *  - Marcus: pure cross-domain inference (film → architecture → music → gifts).
 *  - Tariq: hard taboo guardrails (no alcohol, halal) with a generous budget.
 *  - Elena: tight $200 ceiling that forces the negotiator to find a value bridge.
 */
export const DEMO_VIP_PROFILES: ReadonlyArray<VIPProfileInput & { id: string }> = [
  {
    id: 'vip_marcus_vance',
    fullName: 'Marcus Vance',
    role: 'Managing Partner',
    organization: 'Halcyon Ridge Capital',
    city: 'New York',
    budgetLimitUsd: 500,
    rawBio:
      'Runs a $4B growth fund. Rewatches Christopher Nolan films on long flights — Interstellar is his favourite. ' +
      'Obsessed with Brutalist architecture (has toured the Barbican twice) and writes investment memos to Hans Zimmer and ambient records. ' +
      'Hates small talk about sports; lights up when discussing time, scale and concrete.',
    explicitInterests: ['Christopher Nolan', 'Interstellar', 'Brutalist architecture', 'Hans Zimmer', 'Ambient music'],
    taboos: { alcohol: false, dietary: [], religiousCultural: [] },
  },
  {
    id: 'vip_tariq_al_mansoor',
    fullName: 'Tariq Al-Mansoor',
    role: 'Founder & CEO',
    organization: 'Qamar Systems',
    city: 'Riyadh',
    budgetLimitUsd: 1500,
    rawBio:
      'Founded a Riyadh deep-tech company now expanding into Europe. Collects independent mechanical watchmaking — speaks fluently about ' +
      'hand-finished movements and small Swiss and Japanese ateliers. Lives by minimalist design: Dieter Rams, Japanese craft, quiet materials. ' +
      'Observant Muslim: strictly no alcohol and no pork in any form.',
    explicitInterests: ['Independent watchmaking', 'Minimalist design', 'Dieter Rams', 'Japanese craftsmanship'],
    taboos: {
      alcohol: true,
      dietary: ['halal'],
      religiousCultural: ['No pork-derived materials', 'No alcohol-themed gifts or barware'],
    },
  },
  {
    id: 'vip_elena_rostova',
    fullName: 'Elena Rostova',
    role: 'Chief Creative Officer',
    organization: 'Maison Ostra Media',
    city: 'London',
    budgetLimitUsd: 200,
    rawBio:
      'Creative director behind three fashion-week campaigns. Spent a formative year in New Orleans and still collects traditional jazz on vinyl. ' +
      'Drinks only low-intervention natural wine and follows Rei Kawakubo and Maison Margiela religiously. ' +
      'Allergic to anything that feels corporate.',
    explicitInterests: ['New Orleans jazz', 'Natural wine', 'Avant-garde fashion', 'Comme des Garçons', 'Maison Margiela'],
    taboos: { alcohol: false, dietary: ['shellfish'], religiousCultural: [] },
  },
  {
    id: 'vip_hayao_miyazaki',
    fullName: 'Hayao Miyazaki',
    role: 'Director & Co-Founder',
    organization: 'Studio Ghibli',
    city: 'Tokyo',
    budgetLimitUsd: 500,
    rawBio:
      'Legendary Japanese animation director and animator. Deep reverence for traditional Japanese craftsmanship, Shinto animism, vintage aircraft mechanics, and traditional woodblock printing. Disdains commercial fanfare, values quiet integrity and tactile hand-made artistry.',
    explicitInterests: [
      'Japanese craftsmanship',
      'Tea ceremony & ceramics',
      'Vintage aviation',
      'Traditional watercolor & ink',
      'Nature conservation',
    ],
    taboos: { alcohol: false, dietary: [], religiousCultural: [] },
  },
];

/**
 * Idempotently seeds demo principals. Existing rows are never overwritten so edits made in the console persist.
 */
export function seedDemoData(): { inserted: number; total: number } {
  let inserted = 0;
  for (const profile of DEMO_VIP_PROFILES) {
    if (!vipDossierRepo.getProfile(profile.id)) {
      vipDossierRepo.upsertProfile(profile);
      inserted += 1;
    }
  }
  return { inserted, total: vipDossierRepo.listProfiles().length };
}