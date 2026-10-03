import { envConfig, isRealSecret } from '../config/env.js';
import type { CulturalCategory, CulturalEntity, CulturalTasteGraph } from '../types/index.js';
import {
  buildFallbackTasteGraph,
  expandCuratedCorrelations,
  guessCategory,
  resolveCuratedSeed,
  slugify,
} from './curatedTasteGraph.js';

export interface QlooEntityResponse {
  id?: string;
  name?: string;
  category?: string;
  type?: string;
  score?: number;
  affinity?: number;
  urn?: string;
  properties?: Record<string, unknown>;
}

export interface QlooInsightsResponse {
  entities?: QlooEntityResponse[];
  results?: QlooEntityResponse[];
  data?: QlooEntityResponse[];
  themes?: string[];
}

export class QlooClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor() {
    this.baseUrl = (process.env.QLOO_API_URL || 'https://hackathon.api.qloo.com').replace(/\/+$/, '');
    this.timeoutMs = envConfig.QLOO_TIMEOUT_MS;
  }

  public get isConfigured(): boolean {
    return isRealSecret(process.env.QLOO_API_KEY);
  }

  /**
   * Search for cultural entities matching a query in a specific or broad category.
   */
  public async searchEntities(query: string, category?: CulturalCategory): Promise<CulturalEntity[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    if (!this.isConfigured) {
      const match = resolveCuratedSeed(trimmed);
      return match ? [match] : [{
        id: `curated:${category || guessCategory(trimmed)}:${slugify(trimmed)}`,
        name: trimmed,
        category: category || guessCategory(trimmed),
        affinityScore: 0.95,
        metadata: { source: 'curated_fallback' }
      }];
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      const endpoint = `${this.baseUrl}/v2/search?query=${encodeURIComponent(trimmed)}${category ? `&filter.type=${category}` : ''}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Api-Key': process.env.QLOO_API_KEY!.trim(),
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`[QlooClient] searchEntities returned ${response.status}. Deferring to curated fallback.`);
        const fallback = resolveCuratedSeed(trimmed);
        return fallback ? [fallback] : [];
      }

      const data = (await response.json()) as QlooInsightsResponse;
      const rawList = data.entities || data.results || data.data || [];

      if (rawList.length === 0) {
        const fallback = resolveCuratedSeed(trimmed);
        return fallback ? [fallback] : [];
      }

      return rawList.map((item) => {
        const rawCat = (item.category || item.type || category || guessCategory(item.name || trimmed)) as string;
        const normalizedCat: CulturalCategory = (['music', 'film', 'dining', 'fashion', 'literature', 'architecture'].includes(rawCat)
          ? rawCat
          : guessCategory(item.name || trimmed)) as CulturalCategory;

        return {
          id: item.urn || item.id || `qloo:${normalizedCat}:${slugify(item.name || trimmed)}`,
          name: item.name || trimmed,
          category: normalizedCat,
          affinityScore: Number(item.score || item.affinity || 0.95),
          metadata: { ...item.properties, source: 'qloo_live' },
        };
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[QlooClient] Live search failed (${msg}). Using curated graph.`);
      const fallback = resolveCuratedSeed(trimmed);
      return fallback ? [fallback] : [];
    }
  }

  /**
   * Cross-domain taste correlation.
   * Maps a set of seed interests/entities into correlated affinities across requested cultural categories.
   */
  public async getCrossDomainCorrelations(
    seedInterests: string[],
    targetCategories: CulturalCategory[] = ['music', 'film', 'dining', 'fashion', 'literature', 'architecture']
  ): Promise<CulturalEntity[]> {
    if (!seedInterests || seedInterests.length === 0) return [];

    if (!this.isConfigured) {
      return expandCuratedCorrelations(seedInterests, targetCategories);
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      const endpoint = `${this.baseUrl}/v2/insights`;
      const payload = {
        'signal.interests.entities': seedInterests,
        'filter.types': targetCategories,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Api-Key': process.env.QLOO_API_KEY!.trim(),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`[QlooClient] Insights request returned status ${response.status}. Falling back to curated correlation.`);
        return expandCuratedCorrelations(seedInterests, targetCategories);
      }

      const data = (await response.json()) as QlooInsightsResponse;
      const rawList = data.entities || data.results || data.data || [];

      if (!Array.isArray(rawList) || rawList.length === 0) {
        return expandCuratedCorrelations(seedInterests, targetCategories);
      }

      return rawList.map((item) => {
        const cat = (item.category || item.type || 'dining') as string;
        const normalizedCat: CulturalCategory = (['music', 'film', 'dining', 'fashion', 'literature', 'architecture'].includes(cat)
          ? cat
          : guessCategory(item.name || '')) as CulturalCategory;

        return {
          id: item.urn || item.id || `qloo:${normalizedCat}:${slugify(item.name || 'entity')}`,
          name: item.name || 'Cultural Entity',
          category: normalizedCat,
          affinityScore: Number(item.score || item.affinity || 0.88),
          metadata: { ...item.properties, source: 'qloo_live' },
        };
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[QlooClient] Live cross-domain query failed (${msg}). Falling back to curated correlations.`);
      return expandCuratedCorrelations(seedInterests, targetCategories);
    }
  }

  /**
   * Synthesize a full CulturalTasteGraph for a VIP profile.
   */
  public async fetchTasteGraph(seedInterests: string[]): Promise<CulturalTasteGraph> {
    if (!this.isConfigured) {
      return buildFallbackTasteGraph(seedInterests);
    }

    try {
      const resolvedSeeds: CulturalEntity[] = [];
      for (const seed of seedInterests) {
        const matches = await this.searchEntities(seed);
        if (matches.length > 0) {
          resolvedSeeds.push(matches[0]);
        } else {
          resolvedSeeds.push({
            id: `seed:${guessCategory(seed)}:${slugify(seed)}`,
            name: seed,
            category: guessCategory(seed),
            affinityScore: 0.98,
            metadata: { source: 'seed_input' }
          });
        }
      }

      const expandedEntities = await this.getCrossDomainCorrelations(seedInterests);

      if (expandedEntities.length === 0) {
        return buildFallbackTasteGraph(seedInterests);
      }

      // Derive themes from expanded entities or curated fallback themes
      const fallbackGraph = buildFallbackTasteGraph(seedInterests);
      const crossDomainThemes = fallbackGraph.crossDomainThemes;

      return {
        seedInterests,
        resolvedSeeds,
        expandedEntities,
        crossDomainThemes,
        source: 'qloo_live',
      };
    } catch {
      return buildFallbackTasteGraph(seedInterests);
    }
  }
}

export const qlooClient = new QlooClient();
