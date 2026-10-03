import { describe, it, expect, beforeEach } from 'vitest';
import { qlooTasteExplorerTool } from '../src/tools/qlooTasteExplorer.js';
import { qlooClient } from '../src/services/qlooClient.js';
import { matchClusters, expandCuratedCorrelations, resolveCuratedSeed } from '../src/services/curatedTasteGraph.js';

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
});
