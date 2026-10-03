export interface PromptArgument {
  name: string;
  description?: string;
  required?: boolean;
}

export interface PromptDefinition {
  name: string;
  description: string;
  arguments?: PromptArgument[];
}

export const CHIEF_OF_STAFF_SYSTEM_PROMPT = `You are CuraVIP Executive Concierge & Chief of Staff Intelligence, an elite diplomatic advisor to high-ticket dealmakers, family offices, and Fortune 500 CEOs.

Your primary mission is to eradicate "Cultural Blindness" in relationship building. When preparing an executive for a critical dinner, contract closing, or summit meeting, you NEVER propose generic clichés (no engraved pens, no corporate fruit baskets, no generic golf accessories).

Instead, you operate via a rigorous 3-Stage Autonomous Reasoning Chain:
1. DECONSTRUCT: Extract subtle cultural seeds, aesthetic preferences, architecture affinities, and ethical/religious taboos from unstructured bios and meeting notes.
2. QUERY TASTE GRAPH: Leverage the Qloo Taste Graph via explore_cultural_taste to discover non-obvious, cross-domain correlations (e.g., mapping a love for Christopher Nolan & Brutalism to artisanal Bizen stoneware, minimalist mechanical watchcraft, or rare ambient vinyl).
3. COMPLIANCE AUDIT: Every proposal MUST strictly clear corporate budget ceilings ($200/$500/unlimited), FCPA anti-bribery standards, zero-alcohol protocols (if taboo), and dietary restrictions (Halal, Vegan, etc.) before presentation.

Communication Style:
- Executive, discreet, highly cultured, and concise.
- Provide concrete cultural rationales for every item.
- Offer 2 natural, non-obvious conversational icebreakers that build genuine rapport without feeling rehearsed.`;

export const EXECUTIVE_DOSSIER_BRIEFING_PROMPT = 'executive_dossier_briefing';
export const CULTURAL_GIFT_CURATION_PROMPT = 'cultural_gift_curation';
export const DIPLOMATIC_ICEBREAKER_PROMPT = 'diplomatic_icebreaker_generation';

export const registeredPrompts: PromptDefinition[] = [
  {
    name: EXECUTIVE_DOSSIER_BRIEFING_PROMPT,
    description:
      'Guides the CuraVIP agent to compose a complete Executive Cultural Dossier for a VIP principal prior to a high-ticket negotiation.',
    arguments: [
      {
        name: 'vipName',
        description: 'Name of the VIP principal (e.g. Marcus Vance, Tariq Al-Mansoor)',
        required: true,
      },
      {
        name: 'meetingContext',
        description: 'Context of the upcoming interaction (e.g. Series B closing dinner, bilateral trade summit)',
        required: false,
      },
      {
        name: 'budgetTier',
        description: 'Corporate budget tier constraint (standard_200, executive_500, unlimited_vip)',
        required: false,
      },
    ],
  },
  {
    name: CULTURAL_GIFT_CURATION_PROMPT,
    description:
      'Orchestrates the selection of 3 unique, artisan-grade gift proposals grounded in Qloo cultural correlation and audited against FCPA and personal taboos.',
    arguments: [
      {
        name: 'vipId',
        description: 'ID of the target VIP profile',
        required: true,
      },
      {
        name: 'targetBudget',
        description: 'Maximum allowable budget limit in USD',
        required: false,
      },
    ],
  },
  {
    name: DIPLOMATIC_ICEBREAKER_PROMPT,
    description:
      'Generates 2 natural, sophisticated conversation opening topics grounded in the principal’s cross-domain cultural interests.',
    arguments: [
      {
        name: 'seedInterests',
        description: 'Key cultural interests or aesthetic anchors of the principal',
        required: true,
      },
    ],
  },
];

export async function getPromptHandler(
  name: string,
  args?: Record<string, string>
): Promise<{ description: string; messages: Array<{ role: 'user' | 'assistant'; content: { type: 'text'; text: string } }> }> {
  switch (name) {
    case EXECUTIVE_DOSSIER_BRIEFING_PROMPT: {
      const vipName = args?.vipName || 'the principal';
      const meetingContext = args?.meetingContext || 'an upcoming strategic executive summit';
      const tier = args?.budgetTier || 'executive_500';

      return {
        description: `Briefing generation for ${vipName}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Generate a full executive briefing dossier for ${vipName} regarding ${meetingContext}. Enforce budget tier '${tier}', query the Qloo Taste Graph for cross-domain correlations, and audit all gifts against FCPA and cultural taboos.`,
            },
          },
        ],
      };
    }

    case CULTURAL_GIFT_CURATION_PROMPT: {
      const vipId = args?.vipId || 'selected_vip';
      const targetBudget = args?.targetBudget || '500';

      return {
        description: `Curating bespoke gifts for VIP ${vipId}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Curate 3 distinct gift proposals for principal '${vipId}' under $${targetBudget}. Verify cross-domain affinities and confirm zero alcohol/dietary taboo violations.`,
            },
          },
        ],
      };
    }

    case DIPLOMATIC_ICEBREAKER_PROMPT: {
      const seeds = args?.seedInterests || 'film and modern architecture';

      return {
        description: 'Diplomatic icebreaker generation',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Draft two diplomatic icebreakers connecting ${seeds} with effortless cultural fluency. Avoid standard compliments; focus on shared intellectual appreciation.`,
            },
          },
        ],
      };
    }

    default:
      throw new Error(`MCP Prompt '${name}' is not recognized.`);
  }
}
