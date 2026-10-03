import { describe, it, expect, beforeEach } from 'vitest';
import { complianceGuardrailService } from '../src/services/complianceGuardrailService.js';
import { vipDossierRepo } from '../src/database/vipDossierRepo.js';
import type { DiningProposal, GiftProposal, VIPProfile } from '../src/types/index.js';

describe('Compliance & Guardrail Service', () => {
  const mockProfile: VIPProfile = {
    id: 'vip_test_principal',
    fullName: 'Amir Al-Hassan',
    role: 'Managing Director',
    organization: 'Apex Global Technologies',
    city: 'Dubai',
    budgetLimitUsd: 500,
    rawBio: 'Focuses on deep tech investments.',
    explicitInterests: ['Modernist architecture', 'Specialty coffee'],
    taboos: {
      alcohol: true,
      dietary: ['halal'],
      religiousCultural: ['No pork-derived materials'],
    },
  };

  beforeEach(() => {
    vipDossierRepo.upsertProfile(mockProfile);
  });

  it('passes 100% compliant proposals', () => {
    const validGifts: GiftProposal[] = [
      {
        id: 'gift_compliant_1',
        title: 'Hand-Turned Bizen Stoneware Tea Bowl',
        brandOrArtisan: 'Kakurezaki Studio',
        estimatedPriceUsd: 380,
        category: 'curated_artifact',
        culturalRationale: 'Crafted with natural ash glaze and unglazed clay.',
        qlooCorrelationAnchor: 'Minimalism ∩ Craft',
        materials: ['stoneware clay'],
      },
    ];

    const validDining: DiningProposal[] = [
      {
        id: 'dining_compliant_1',
        venueName: 'Sumosan Contemporary Japanese Salon',
        cuisineType: 'Halal Certified Wagyu & Robata',
        neighborhood: 'Downtown Dubai',
        vibeAnchor: 'Zen Minimalist Salon',
        pairingNotes: 'Cold-brew Gyokuro tea infusions',
        culturalRationale: 'Halal certified dining with private meeting quarters.',
      },
    ];

    const result = complianceGuardrailService.auditCompliance(
      mockProfile,
      validGifts,
      validDining,
      'executive_500'
    );

    expect(result.isCompliant).toBe(true);
    expect(result.fcpaRiskLevel).not.toBe('high');
    expect(result.tabooViolations.length).toBe(0);
    expect(result.blockedItems.length).toBe(0);
  });

  it('detects and blocks gifts exceeding the budget ceiling ($500 cap)', () => {
    const overbudgetGift: GiftProposal[] = [
      {
        id: 'gift_overbudget',
        title: 'Rare Vintage Tourbillon Clock',
        brandOrArtisan: 'Swiss Haute Horology',
        estimatedPriceUsd: 1200, // Exceeds $500 cap
        category: 'bespoke_craft',
        culturalRationale: 'Mechanical masterpiece.',
        qlooCorrelationAnchor: 'Horology',
      },
    ];

    const result = complianceGuardrailService.auditCompliance(
      mockProfile,
      overbudgetGift,
      [],
      'executive_500'
    );

    expect(result.isCompliant).toBe(false);
    expect(result.blockedItems.some((b) => b.itemId === 'gift_overbudget')).toBe(true);
    const budgetCheck = result.checks.find((c) => c.id === 'budget');
    expect(budgetCheck?.status).toBe('fail');
  });

  it('blocks alcohol gifts and alcohol dining pairings for alcohol-free principals', () => {
    const alcoholGifts: GiftProposal[] = [
      {
        id: 'gift_whisky',
        title: '18-Year Single Malt Islay Scotch Whisky',
        brandOrArtisan: 'Bowmore Distillery',
        estimatedPriceUsd: 220,
        category: 'rare_vintage',
        culturalRationale: 'Peated single malt for celebrations.',
        qlooCorrelationAnchor: 'Distillery',
      },
    ];

    const alcoholDining: DiningProposal[] = [
      {
        id: 'dining_wine_bar',
        venueName: 'Le Cellier Grand Cru',
        cuisineType: 'French Bistro',
        neighborhood: 'Financial Center',
        vibeAnchor: 'Wine Vault',
        pairingNotes: 'Paired with vintage Bordeaux wine flights',
        culturalRationale: 'World-class wine selection.',
      },
    ];

    const result = complianceGuardrailService.auditCompliance(
      mockProfile,
      alcoholGifts,
      alcoholDining,
      'executive_500'
    );

    expect(result.isCompliant).toBe(false);
    expect(result.tabooViolations.length).toBeGreaterThanOrEqual(2);
    expect(result.blockedItems.some((b) => b.itemId === 'gift_whisky')).toBe(true);
    expect(result.blockedItems.some((b) => b.itemId === 'dining_wine_bar')).toBe(true);
    const alcoholCheck = result.checks.find((c) => c.id === 'alcohol');
    expect(alcoholCheck?.status).toBe('fail');
  });

  it('flags duplicate gifts based on previous curation history', () => {
    // Record past curation
    vipDossierRepo.recordCuration(mockProfile.id, 'gift', 'Dieter Rams Exhibition Catalog');

    const duplicateGift: GiftProposal[] = [
      {
        id: 'gift_dup',
        title: 'Dieter Rams Exhibition Catalog',
        brandOrArtisan: 'Gestalten',
        estimatedPriceUsd: 120,
        category: 'literature_edition',
        culturalRationale: 'Functional design monograph.',
        qlooCorrelationAnchor: 'Industrial Design',
      },
    ];

    const result = complianceGuardrailService.auditCompliance(
      mockProfile,
      duplicateGift,
      [],
      'executive_500'
    );

    expect(result.isCompliant).toBe(false);
    const precedentCheck = result.checks.find((c) => c.id === 'precedent');
    expect(precedentCheck?.status).toBe('fail');
    expect(result.tabooViolations.some((v) => v.includes('Precedent violation'))).toBe(true);
  });
});
