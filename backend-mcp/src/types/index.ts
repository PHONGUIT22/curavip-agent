/**
 * CuraVIP domain schema.
 * This file is mirrored verbatim in frontend/src/types/index.ts — keep both in sync.
 */

// ---------------------------------------------------------------------------
// Budget & execution
// ---------------------------------------------------------------------------

export type BudgetTier = 'standard_200' | 'executive_500' | 'unlimited_vip';

/** Corporate gifting ceiling per tier in USD. `null` means no tier ceiling (profile limit still applies). */
export const BUDGET_TIER_CAPS: Record<BudgetTier, number | null> = {
  standard_200: 200,
  executive_500: 500,
  unlimited_vip: null,
};

export const BUDGET_TIER_LABELS: Record<BudgetTier, string> = {
  standard_200: 'Standard · $200',
  executive_500: 'Executive · $500',
  unlimited_vip: 'Unlimited VIP',
};

export type ExecutionMode = 'qloo_grounded' | 'generic_llm';

/** Where the taste graph came from. */
export type TasteGraphSource = 'qloo_live' | 'curated_fallback' | 'none';

/** Which reasoning engine produced the dossier. */
export type AgentEngine = 'bedrock_claude' | 'autonomous_planner' | 'generic_baseline';

// ---------------------------------------------------------------------------
// Cultural taste graph
// ---------------------------------------------------------------------------

export type CulturalCategory = 'music' | 'film' | 'dining' | 'fashion' | 'literature' | 'architecture';

export const CULTURAL_CATEGORIES: readonly CulturalCategory[] = [
  'music',
  'film',
  'dining',
  'fashion',
  'literature',
  'architecture',
] as const;

export interface CulturalEntity {
  id: string;
  name: string;
  category: CulturalCategory;
  /** 0..1 affinity relative to the seed signals. */
  affinityScore: number;
  metadata?: Record<string, unknown>;
}

export interface CulturalTasteGraph {
  seedInterests: string[];
  /** Seed interests resolved to concrete Taste Graph entities. */
  resolvedSeeds: CulturalEntity[];
  expandedEntities: CulturalEntity[];
  crossDomainThemes: string[];
  source: TasteGraphSource;
}

// ---------------------------------------------------------------------------
// Principals
// ---------------------------------------------------------------------------

export interface VIPTaboos {
  alcohol: boolean;
  /** e.g. ['halal', 'vegan', 'shellfish'] */
  dietary: string[];
  religiousCultural: string[];
}

export interface VIPProfile {
  id: string;
  fullName: string;
  role: string;
  organization: string;
  city: string;
  budgetLimitUsd: number;
  rawBio: string;
  explicitInterests: string[];
  taboos: VIPTaboos;
  createdAt?: string;
}

export type VIPProfileInput = Omit<VIPProfile, 'id' | 'createdAt'> & { id?: string };

// ---------------------------------------------------------------------------
// Proposals
// ---------------------------------------------------------------------------

export type GiftCategory = 'curated_artifact' | 'rare_vintage' | 'bespoke_craft' | 'literature_edition';
export type GiftTier = 'signature' | 'alternative' | 'discreet';

export interface GiftProposal {
  id: string;
  title: string;
  brandOrArtisan: string;
  estimatedPriceUsd: number;
  category: GiftCategory;
  culturalRationale: string;
  qlooCorrelationAnchor: string;
  purchaseUrl?: string;
  tier?: GiftTier;
  /** Materials / contents used by the taboo guardrail (e.g. 'leather', 'single malt whisky'). */
  materials?: string[];
  affinityScore?: number;
}

export interface DiningProposal {
  id: string;
  venueName: string;
  cuisineType: string;
  neighborhood: string;
  vibeAnchor: string;
  pairingNotes: string;
  culturalRationale: string;
  priceBand?: '$$$' | '$$$$';
  /** Ingredients / service elements used by the taboo guardrail. */
  serviceElements?: string[];
}

// ---------------------------------------------------------------------------
// Compliance
// ---------------------------------------------------------------------------

export type FcpaRiskLevel = 'low' | 'medium' | 'high';
export type ComplianceCheckId = 'budget' | 'fcpa' | 'alcohol' | 'dietary' | 'religious_cultural' | 'precedent';
export type ComplianceCheckStatus = 'pass' | 'warn' | 'fail';

export interface ComplianceCheck {
  id: ComplianceCheckId;
  label: string;
  status: ComplianceCheckStatus;
  detail: string;
}

export interface BlockedItem {
  itemId: string;
  itemName: string;
  itemType: 'gift' | 'dining';
  reasons: string[];
}

export interface ComplianceAuditResult {
  isCompliant: boolean;
  fcpaRiskLevel: FcpaRiskLevel;
  budgetChecked: boolean;
  tabooViolations: string[];
  auditNotes: string;
  checks: ComplianceCheck[];
  blockedItems: BlockedItem[];
  effectiveBudgetCapUsd: number | null;
  auditedAt: string;
}

// ---------------------------------------------------------------------------
// Dossier
// ---------------------------------------------------------------------------

export interface ExecutiveDossier {
  vipProfile: VIPProfile;
  tasteGraph: CulturalTasteGraph;
  iceBreakerScripts: string[];
  curatedGifts: GiftProposal[];
  diningOptions: DiningProposal[];
  complianceAudit: ComplianceAuditResult;
  generatedAt: string;
  executionMode: ExecutionMode;
  budgetTier: BudgetTier;
  agentEngine: AgentEngine;
  strategicSummary: string;
}

export type AgentPhase = 'deconstruct' | 'query_graph' | 'curate' | 'audit' | 'negotiate' | 'commit';
export type AgentStepStatus = 'ok' | 'fallback' | 'blocked' | 'error';
export type AgentStepSource = 'qloo_live' | 'curated_fallback' | 'bedrock' | 'local';

export interface AgentTraceStep {
  id: string;
  phase: AgentPhase;
  tool: string;
  title: string;
  detail: string;
  durationMs: number;
  status: AgentStepStatus;
  source: AgentStepSource;
}

export interface DossierRequest {
  vipId: string;
  meetingBrief?: string;
  mode: ExecutionMode;
  budgetTier?: BudgetTier;
}

export interface DossierResponse {
  recordId: string;
  dossier: ExecutiveDossier;
  trace: AgentTraceStep[];
}

export interface DossierComparisonResponse {
  grounded: DossierResponse;
  generic: DossierResponse;
}

export interface DossierRecord {
  id: string;
  vipId: string;
  dossier: ExecutiveDossier;
  isBookmarked: boolean;
  createdAt: string;
}

export interface CurationHistoryEntry {
  id: string;
  vipId: string;
  itemType: 'gift' | 'dining';
  itemName: string;
  awardedAt: string;
}

// ---------------------------------------------------------------------------
// Fulfilment & negotiation
// ---------------------------------------------------------------------------

export interface ReservationRequest {
  vipId: string;
  gift?: Pick<GiftProposal, 'id' | 'title' | 'brandOrArtisan' | 'estimatedPriceUsd'> &
    Partial<Pick<GiftProposal, 'materials' | 'category'>>;
  dining?: {
    venueName: string;
    partySize: number;
    requestedDate: string;
    privateRoom: boolean;
    notes?: string;
  };
  budgetTier?: BudgetTier;
}

export interface ReservationOrder {
  id: string;
  vipId: string;
  confirmationCode: string;
  status: 'drafted' | 'held_for_compliance';
  giftOrder: {
    title: string;
    brandOrArtisan: string;
    estimatedPriceUsd: number;
    handNote: string;
  } | null;
  diningReservation: {
    venueName: string;
    partySize: number;
    requestedDate: string;
    privateRoom: boolean;
    serviceBrief: string;
  } | null;
  complianceCleared: boolean;
  complianceNotes: string[];
  createdAt: string;
}

export interface TasteNegotiationResult {
  bridgeTheme: string;
  rationale: string;
  resolvedProposals: GiftProposal[];
  budgetAdjusted: boolean;
  notes: string[];
}

export interface HealthStatus {
  status: 'ok';
  service: string;
  version: string;
  qlooConfigured: boolean;
  bedrockConfigured: boolean;
  mcpEndpoint: string;
}