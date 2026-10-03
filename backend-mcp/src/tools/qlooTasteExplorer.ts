import { qlooClient } from '../services/qlooClient.js';
import type { CulturalCategory, CulturalEntity } from '../types/index.js';

export interface ExploreCulturalTasteInput {
  interests: string[];
  categories?: CulturalCategory[];
}

export interface ExploreCulturalTasteResult {
  seedInterests: string[];
  entities: CulturalEntity[];
  domainBreakdown: Record<string, number>;
  source: 'qloo_live' | 'curated_fallback';
  thematicSummary: string;
}

export const qlooTasteExplorerTool = {
  definition: {
    name: 'explore_cultural_taste',
    description:
      'Queries the Qloo Taste Graph (or curated high-affinity fallback) to explore non-obvious cross-domain cultural correlations from seed interests (e.g. mapping cinema to rare dining, niche vinyl, and architectural aesthetics).',
    inputSchema: {
      type: 'object',
      properties: {
        interests: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of seed cultural interests, creators, works, or aesthetics (e.g. ["Christopher Nolan", "Brutalist architecture"]).',
        },
        categories: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['music', 'film', 'dining', 'fashion', 'literature', 'architecture'],
          },
          description: 'Target cultural categories to cross-correlate into.',
        },
      },
      required: ['interests'],
    },
  },

  async handler(args: ExploreCulturalTasteInput): Promise<ExploreCulturalTasteResult> {
    const interests = Array.isArray(args.interests) ? args.interests.filter(Boolean) : [];
    if (interests.length === 0) {
      return {
        seedInterests: [],
        entities: [],
        domainBreakdown: {},
        source: 'curated_fallback',
        thematicSummary: 'No seed interests provided for cultural exploration.',
      };
    }

    const categories = (args.categories && args.categories.length > 0)
      ? args.categories
      : (['music', 'film', 'dining', 'fashion', 'literature', 'architecture'] as CulturalCategory[]);

    const entities = await qlooClient.getCrossDomainCorrelations(interests, categories);
    const source = entities.some((e) => e.metadata?.source === 'qloo_live') ? 'qloo_live' : 'curated_fallback';

    const domainBreakdown: Record<string, number> = {};
    for (const ent of entities) {
      domainBreakdown[ent.category] = (domainBreakdown[ent.category] || 0) + 1;
    }

    const topEntities = entities.slice(0, 5).map((e) => `${e.name} (${e.category})`).join(', ');
    const thematicSummary = `Mapped [${interests.join(', ')}] across ${categories.length} cultural domains. Identified key affinity nodes: ${topEntities}.`;

    return {
      seedInterests: interests,
      entities,
      domainBreakdown,
      source,
      thematicSummary,
    };
  },
};
