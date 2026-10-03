import { randomUUID } from 'node:crypto';
import { vipDossierRepo } from '../database/vipDossierRepo.js';
import { complianceGuardrailService } from '../services/complianceGuardrailService.js';
import type { BudgetTier, DiningProposal, GiftProposal, ReservationOrder, ReservationRequest } from '../types/index.js';

export interface CommitReservationInput {
  vipId: string;
  gift?: {
    id: string;
    title: string;
    brandOrArtisan: string;
    estimatedPriceUsd: number;
    category?: 'curated_artifact' | 'rare_vintage' | 'bespoke_craft' | 'literature_edition';
    materials?: string[];
  };
  dining?: {
    venueName: string;
    partySize: number;
    requestedDate: string;
    privateRoom: boolean;
    notes?: string;
  };
  budgetTier?: BudgetTier;
}

export const curateBookingOrderTool = {
  definition: {
    name: 'commit_curated_reservation',
    description:
      'Creates a luxury reservation spec and procurement order draft for a VIP gift and/or exclusive dining reservation, validating FCPA compliance and logging curation precedent.',
    inputSchema: {
      type: 'object',
      properties: {
        vipId: {
          type: 'string',
          description: 'Unique ID of the VIP principal.',
        },
        gift: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            brandOrArtisan: { type: 'string' },
            estimatedPriceUsd: { type: 'number' },
            category: { type: 'string' },
            materials: { type: 'array', items: { type: 'string' } },
          },
          required: ['id', 'title', 'brandOrArtisan', 'estimatedPriceUsd'],
          description: 'Gift proposal selected for procurement.',
        },
        dining: {
          type: 'object',
          properties: {
            venueName: { type: 'string' },
            partySize: { type: 'number' },
            requestedDate: { type: 'string' },
            privateRoom: { type: 'boolean' },
            notes: { type: 'string' },
          },
          required: ['venueName', 'partySize', 'requestedDate', 'privateRoom'],
          description: 'Dining reservation details.',
        },
        budgetTier: {
          type: 'string',
          enum: ['standard_200', 'executive_500', 'unlimited_vip'],
          description: 'Corporate policy budget tier.',
        },
      },
      required: ['vipId'],
    },
  },

  async handler(args: CommitReservationInput): Promise<ReservationOrder> {
    const profile = vipDossierRepo.getProfile(args.vipId);
    if (!profile) {
      throw new Error(`Principal with ID '${args.vipId}' not found.`);
    }

    const giftsToAudit: GiftProposal[] = args.gift
      ? [{
          id: args.gift.id,
          title: args.gift.title,
          brandOrArtisan: args.gift.brandOrArtisan,
          estimatedPriceUsd: args.gift.estimatedPriceUsd,
          category: args.gift.category || 'curated_artifact',
          culturalRationale: 'Procured for relationship engagement',
          qlooCorrelationAnchor: 'Executive Curation',
          materials: args.gift.materials || [],
        }]
      : [];

    const diningToAudit: DiningProposal[] = args.dining
      ? [{
          id: `dining_${randomUUID().slice(0, 8)}`,
          venueName: args.dining.venueName,
          cuisineType: 'Curated Executive Dining',
          neighborhood: profile.city,
          vibeAnchor: 'Private Salon',
          pairingNotes: 'Curated pairings',
          culturalRationale: 'Executive hospitality booking',
        }]
      : [];

    const audit = complianceGuardrailService.auditCompliance(
      profile,
      giftsToAudit,
      diningToAudit,
      args.budgetTier || 'executive_500'
    );

    const confirmationCode = `VIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const order: ReservationOrder = {
      id: `ord_${randomUUID()}`,
      vipId: profile.id,
      confirmationCode,
      status: audit.isCompliant ? 'drafted' : 'held_for_compliance',
      giftOrder: args.gift
        ? {
            title: args.gift.title,
            brandOrArtisan: args.gift.brandOrArtisan,
            estimatedPriceUsd: args.gift.estimatedPriceUsd,
            handNote: `Presented to ${profile.fullName}, ${profile.role} at ${profile.organization}. With compliments.`,
          }
        : null,
      diningReservation: args.dining
        ? {
            venueName: args.dining.venueName,
            partySize: args.dining.partySize,
            requestedDate: args.dining.requestedDate,
            privateRoom: args.dining.privateRoom,
            serviceBrief: `Confidential booking for ${profile.fullName} party of ${args.dining.partySize}. Dietary protocols: ${(profile.taboos.dietary || []).join(', ') || 'Standard'}.`,
          }
        : null,
      complianceCleared: audit.isCompliant,
      complianceNotes: audit.isCompliant ? ['FCPA & Taboo Checked'] : audit.tabooViolations,
      createdAt: new Date().toISOString(),
    };

    vipDossierRepo.saveReservationOrder(order);

    if (audit.isCompliant) {
      if (args.gift) {
        vipDossierRepo.recordCuration(profile.id, 'gift', args.gift.title);
      }
      if (args.dining) {
        vipDossierRepo.recordCuration(profile.id, 'dining', args.dining.venueName);
      }
    }

    return order;
  },
};
