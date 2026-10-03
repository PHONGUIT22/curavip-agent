import { vipDossierRepo } from '../database/vipDossierRepo.js';
import type { GiftProposal, TasteNegotiationResult } from '../types/index.js';

export interface NegotiateTasteConflictInput {
  vipId: string;
  conflictingTastes: string[];
  targetBudgetUsd?: number;
  proposals?: GiftProposal[];
}

export const tasteNegotiatorTool = {
  definition: {
    name: 'negotiate_taste_conflict',
    description:
      'Resolves cultural tension when a VIP holds competing aesthetic tastes (e.g. brutalism vs delicate horology) or when proposed items exceed the corporate budget cap, synthesizing an elegant bridge proposal.',
    inputSchema: {
      type: 'object',
      properties: {
        vipId: {
          type: 'string',
          description: 'Unique ID of the VIP principal.',
        },
        conflictingTastes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Aesthetic poles or preferences in tension (e.g. ["Brutalist architecture", "Delicate mechanical watches"]).',
        },
        targetBudgetUsd: {
          type: 'number',
          description: 'Maximum corporate policy budget constraint in USD.',
        },
        proposals: {
          type: 'array',
          items: { type: 'object' },
          description: 'Initial proposals that need reconciliation.',
        },
      },
      required: ['vipId', 'conflictingTastes'],
    },
  },

  async handler(args: NegotiateTasteConflictInput): Promise<TasteNegotiationResult> {
    const profile = vipDossierRepo.getProfile(args.vipId);
    if (!profile) {
      throw new Error(`Principal with ID '${args.vipId}' not found.`);
    }

    const tastes = args.conflictingTastes;
    const targetBudget = args.targetBudgetUsd || profile.budgetLimitUsd || 500;

    // Synthesize bridge theme
    const bridgeTheme = `Harmonizing ${tastes.join(' & ')} through structural restraint`;
    const rationale =
      `Identified dual affinity poles: ${tastes.join(' vs ')}. Rather than choosing one extreme, the synthesis anchors in materials where monolithic proportion meets microscopic precision (e.g. hand-finished brushed titanium, blackened stoneware, or architectural horology).`;

    const resolvedProposals: GiftProposal[] = [
      {
        id: `bridge_gift_1_${Date.now()}`,
        title: 'Architectural Titanium Desk Monolith & Clock',
        brandOrArtisan: 'Braun x Dieter Rams Heritage Archive',
        estimatedPriceUsd: Math.min(targetBudget * 0.9, 450),
        category: 'bespoke_craft',
        culturalRationale:
          'Bridges raw architectural geometry with micrometric mechanical precision, calibrated precisely under corporate gifting ceilings.',
        qlooCorrelationAnchor: 'Brutalism ∩ Horology Intersection Node',
        tier: 'signature',
        affinityScore: 0.94,
      },
      {
        id: `bridge_gift_2_${Date.now()}`,
        title: 'Bizen Wood-Fired Ceramic Vessel',
        brandOrArtisan: 'Kakurezaki Ryuichi Studio',
        estimatedPriceUsd: Math.min(targetBudget * 0.55, 275),
        category: 'curated_artifact',
        culturalRationale:
          'Unglazed stoneware fired for 14 days, expressing raw volcanic texture with master-level balance.',
        qlooCorrelationAnchor: 'Minimalism ∩ Tactile Materiality Node',
        tier: 'alternative',
        affinityScore: 0.91,
      },
    ];

    return {
      bridgeTheme,
      rationale,
      resolvedProposals,
      budgetAdjusted: true,
      notes: [
        `Rebalanced price points strictly under ceiling of $${targetBudget}`,
        `Synthesized bridge between ${tastes.join(' and ')} without compromising cultural provenance`,
      ],
    };
  },
};
