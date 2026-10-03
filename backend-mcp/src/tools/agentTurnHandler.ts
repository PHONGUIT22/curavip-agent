import { invokeBedrockWithTools } from '../aws/bedrockClient.js';
import { qlooTasteExplorerTool } from './qlooTasteExplorer.js';
import { curateBookingOrderTool } from './curateBookingOrder.js';
import { tasteNegotiatorTool } from './tasteNegotiator.js';
import { vipDossierRepo } from '../database/vipDossierRepo.js';
import type { AgentTraceStep, BudgetTier, ExecutionMode } from '../types/index.js';

export interface AgentTurnRequest {
  query: string;
  vipId?: string;
  budgetTier?: BudgetTier;
  mode?: ExecutionMode;
  context?: {
    meetingBrief?: string;
    seedInterests?: string[];
  };
}

export interface AgentTurnResponse {
  success: boolean;
  toolName: string | null;
  toolArgs: Record<string, any> | null;
  toolResult: any | null;
  speechResponse: string;
  offlineFallbackUsed?: boolean;
  traceStep?: AgentTraceStep;
}

/**
 * Autonomous Offline Intent Parser:
 * Intelligently routes queries when running offline or when AWS Bedrock credentials are not present.
 */
function resolveOfflineIntent(
  query: string,
  vipId: string = 'vip_marcus_vance',
  tier: BudgetTier = 'executive_500'
): {
  toolName: string;
  toolArgs: Record<string, any>;
} {
  const lower = query.toLowerCase();

  // 1. Taste Negotiation / Conflict Intent
  if (
    lower.includes('conflict') ||
    lower.includes('tension') ||
    lower.includes('competing') ||
    lower.includes('reconcile') ||
    lower.includes('balance') ||
    lower.includes('bridge') ||
    (lower.includes('budget') && lower.includes('over'))
  ) {
    return {
      toolName: 'negotiate_taste_conflict',
      toolArgs: {
        vipId,
        conflictingTastes: ['Brutalist Architecture', 'Bespoke Mechanical Horology'],
        targetBudgetUsd: tier === 'standard_200' ? 200 : tier === 'executive_500' ? 500 : 1500,
      },
    };
  }

  // 2. Reservation & Procurement Intent
  if (
    lower.includes('reserve') ||
    lower.includes('book') ||
    lower.includes('commit') ||
    lower.includes('order') ||
    lower.includes('procure') ||
    lower.includes('buy')
  ) {
    return {
      toolName: 'commit_curated_reservation',
      toolArgs: {
        vipId,
        gift: {
          id: 'gift_curated_primary',
          title: 'Hand-Turned Japanese Bizen Ware Ceramic Vessel',
          brandOrArtisan: 'Kakurezaki Ryuichi Studio',
          estimatedPriceUsd: tier === 'standard_200' ? 195 : 450,
          category: 'curated_artifact',
        },
        dining: {
          venueName: 'Kappo Masa Private Salon',
          partySize: 2,
          requestedDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
          privateRoom: true,
        },
        budgetTier: tier,
      },
    };
  }

  // 3. Default: Qloo Cultural Taste Exploration
  const profile = vipDossierRepo.getProfile(vipId);
  const seedInterests = profile?.explicitInterests?.length
    ? profile.explicitInterests
    : ['Christopher Nolan', 'Brutalist architecture', 'Hans Zimmer', 'Minimalist design'];

  return {
    toolName: 'explore_cultural_taste',
    toolArgs: {
      interests: seedInterests,
      categories: ['music', 'film', 'dining', 'fashion', 'literature', 'architecture'],
    },
  };
}

export async function handleAgentTurn(request: AgentTurnRequest): Promise<AgentTurnResponse> {
  const startTime = Date.now();
  const vipId = request.vipId || 'vip_marcus_vance';
  const tier = request.budgetTier || 'executive_500';

  // 1. Try AWS Bedrock with native tool calling
  const bedrockDecision = await invokeBedrockWithTools(request.query, {
    vipProfileId: vipId,
    explicitInterests: request.context?.seedInterests,
  });

  if (bedrockDecision?.toolCall) {
    const { name, input } = bedrockDecision.toolCall;
    let toolResult: any = null;
    let speechResponse = '';

    if (name === 'explore_cultural_taste') {
      toolResult = await qlooTasteExplorerTool.handler(input as any);
      speechResponse = `Taste Graph analyzed. Correlated ${toolResult.entities?.length || 0} cultural entities across dining, music, and bespoke artifacts with Qloo cultural grounding.`;
    } else if (name === 'commit_curated_reservation') {
      toolResult = await curateBookingOrderTool.handler(input as any);
      speechResponse = `Reservation draft prepared with confirmation ${toolResult.confirmationCode}. 100% FCPA compliance verified.`;
    } else if (name === 'negotiate_taste_conflict') {
      toolResult = await tasteNegotiatorTool.handler(input as any);
      speechResponse = `Aesthetic tension resolved. Synthesized bridge proposal: ${toolResult.bridgeTheme}.`;
    }

    const duration = Date.now() - startTime;
    return {
      success: true,
      toolName: name,
      toolArgs: input,
      toolResult,
      speechResponse: speechResponse || bedrockDecision.textResponse || 'Strategic analysis completed.',
      offlineFallbackUsed: false,
      traceStep: {
        id: `step_${Date.now()}`,
        phase: name === 'explore_cultural_taste' ? 'query_graph' : name === 'commit_curated_reservation' ? 'commit' : 'negotiate',
        tool: name,
        title: `Executed ${name}`,
        detail: speechResponse,
        durationMs: duration,
        status: 'ok',
        source: 'bedrock',
      },
    };
  }

  // 2. Direct Bedrock text response without tools
  if (bedrockDecision?.textResponse) {
    return {
      success: true,
      toolName: null,
      toolArgs: null,
      toolResult: null,
      speechResponse: bedrockDecision.textResponse,
      offlineFallbackUsed: false,
    };
  }

  // 3. Autonomous Offline Fallback Engine
  const offlineIntent = resolveOfflineIntent(request.query, vipId, tier);
  let offlineResult: any = null;
  let offlineSpeech = '';

  if (offlineIntent.toolName === 'explore_cultural_taste') {
    offlineResult = await qlooTasteExplorerTool.handler(offlineIntent.toolArgs as any);
    offlineSpeech = `Cross-domain taste graph mapped for principal. Retrieved ${offlineResult.entities?.length || 0} correlated cultural entities.`;
  } else if (offlineIntent.toolName === 'commit_curated_reservation') {
    offlineResult = await curateBookingOrderTool.handler(offlineIntent.toolArgs as any);
    offlineSpeech = `Procurement spec drafted: ${offlineResult.confirmationCode}. Compliant with $${tier === 'standard_200' ? 200 : 500} ceiling.`;
  } else if (offlineIntent.toolName === 'negotiate_taste_conflict') {
    offlineResult = await tasteNegotiatorTool.handler(offlineIntent.toolArgs as any);
    offlineSpeech = `Reconciled aesthetic poles. Proposed balanced artifact: ${offlineResult.resolvedProposals?.[0]?.title}.`;
  }

  const duration = Date.now() - startTime;
  return {
    success: true,
    toolName: offlineIntent.toolName,
    toolArgs: offlineIntent.toolArgs,
    toolResult: offlineResult,
    speechResponse: offlineSpeech,
    offlineFallbackUsed: true,
    traceStep: {
      id: `step_${Date.now()}`,
      phase: offlineIntent.toolName === 'explore_cultural_taste' ? 'query_graph' : 'curate',
      tool: offlineIntent.toolName,
      title: `Executed ${offlineIntent.toolName} (Autonomous Offline Mode)`,
      detail: offlineSpeech,
      durationMs: duration,
      status: 'ok',
      source: 'local',
    },
  };
}
