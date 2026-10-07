import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { qlooTasteExplorerTool } from '../src/tools/qlooTasteExplorer.js';
import { qlooClient } from '../src/services/qlooClient.js';
import { matchClusters, expandCuratedCorrelations, resolveCuratedSeed } from '../src/services/curatedTasteGraph.js';
import { qlooCacheRepo } from '../src/database/qlooCacheRepo.js';

describe('Qloo Taste Explorer & Cultural Graph', () => {
  it('correctly matches cluster for Christopher Nolan and Brutalism', () => {
    const matches = matchClusters(['Christopher Nolan', 'Brutalist architecture']);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].cluster.id).toBe('monumental_cerebral');
  });

  it('correctly matches cluster for horology and minimalist design', () => {
    const matches = matchClusters(['Mechanical watches', 'Dieter Rams']);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].cluster.id).toBe('precision_minimalism');
  });

  it('resolves curated seeds accurately', () => {
    const nolan = resolveCuratedSeed('Interstellar');
    expect(nolan).not.toBeNull();
    expect(nolan?.category).toBe('film');
    expect(nolan?.name).toBe('Interstellar');
  });

  it('expands cross-domain correlations from seeds', () => {
    const correlations = expandCuratedCorrelations(['New Orleans jazz', 'Natural wine']);
    expect(correlations.length).toBeGreaterThan(0);
    const categories = new Set(correlations.map((c) => c.category));
    expect(categories.has('music')).toBe(true);
    expect(categories.has('dining')).toBe(true);
    expect(categories.has('fashion')).toBe(true);
  });

  it('executes explore_cultural_taste MCP tool handler', async () => {
    const result = await qlooTasteExplorerTool.handler({
      interests: ['Christopher Nolan', 'Hans Zimmer', 'Brutalist architecture'],
      categories: ['music', 'architecture', 'dining'],
    });

    expect(result.seedInterests).toEqual(['Christopher Nolan', 'Hans Zimmer', 'Brutalist architecture']);
    expect(result.entities.length).toBeGreaterThan(0);
    expect(result.domainBreakdown).toBeDefined();
    expect(result.thematicSummary).toContain('Hans Zimmer');
  });

  it('handles empty seeds gracefully', async () => {
    const result = await qlooTasteExplorerTool.handler({
      interests: [],
    });
    expect(result.entities.length).toBe(0);
  });

  describe('QlooClient Live Specs Compliance', () => {
    const originalFetch = global.fetch;
    const originalKey = process.env.QLOO_API_KEY;

    beforeEach(() => {
      process.env.QLOO_API_KEY = 'test_qloo_live_key_12345';
      qlooCacheRepo.clear();
    });

    afterEach(() => {
      global.fetch = originalFetch;
      process.env.QLOO_API_KEY = originalKey;
      qlooCacheRepo.clear();
    });

    it('calls GET /search with X-Api-Key and parses entity URN', async () => {
      const calls: Array<{ url: string; options: any }> = [];
      global.fetch = (async (url: string | URL | Request, options?: any) => {
        calls.push({ url: url.toString(), options });
        return {
          ok: true,
          status: 200,
          json: async () => ({
            results: [
              {
                id: 'urn:entity:movie:interstellar_2014',
                name: 'Interstellar',
                type: 'movie',
                score: 0.98,
              },
            ],
          }),
        } as any;
      }) as typeof fetch;

      const entities = await qlooClient.searchEntities('Interstellar', 'film');
      expect(calls.length).toBe(1);
      expect(calls[0].url).toContain('/search?query=Interstellar&types=urn%3Aentity%3Amovie');
      expect(calls[0].options.method).toBe('GET');
      expect(calls[0].options.headers['X-Api-Key']).toBe('test_qloo_live_key_12345');
      expect(entities[0].id).toBe('urn:entity:movie:interstellar_2014');
      expect(entities[0].category).toBe('film');
      expect(entities[0].metadata?.source).toBe('qloo_live');
    });

    it('calls GET /v2/insights with query params (no POST) and parallel filter.types', async () => {
      const calls: Array<{ url: string; options: any }> = [];
      global.fetch = (async (url: string | URL | Request, options?: any) => {
        const urlStr = url.toString();
        calls.push({ url: urlStr, options });

        // Search mock
        if (urlStr.includes('/search')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              results: [
                {
                  id: 'urn:entity:artist:hans_zimmer',
                  name: 'Hans Zimmer',
                  type: 'artist',
                  score: 0.99,
                },
              ],
            }),
          } as any;
        }

        // Insights mock
        return {
          ok: true,
          status: 200,
          json: async () => ({
            results: [
              {
                urn: 'urn:entity:place:blue_note_tokyo',
                name: 'Blue Note Tokyo',
                score: 0.91,
              },
            ],
          }),
        } as any;
      }) as typeof fetch;

      const results = await qlooClient.getCrossDomainCorrelations(
        ['Hans Zimmer'],
        ['dining', 'music'],
        'Tokyo'
      );

      expect(results.length).toBeGreaterThan(0);
      const insightCalls = calls.filter((c) => c.url.includes('/v2/insights'));
      expect(insightCalls.length).toBeGreaterThan(0);
      for (const call of insightCalls) {
        expect(call.options.method).toBe('GET');
        expect(call.options.body).toBeUndefined();
        expect(call.options.headers['X-Api-Key']).toBe('test_qloo_live_key_12345');
        expect(call.url).toContain('signal.interests.entities=urn%3Aentity%3Aartist%3Ahans_zimmer');
      }
    });
  });
});
