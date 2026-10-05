import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { qlooCacheRepo } from '../src/database/qlooCacheRepo.js';
import app from '../src/server.js';

describe('Qloo Cache & Real-Time SSE Streaming Pipeline', () => {

  beforeEach(() => {
    qlooCacheRepo.cleanExpired();
  });

  describe('qlooCacheRepo (2-Tier L1/L2 Caching)', () => {
    it('sets and retrieves items from L1 and L2 cache', () => {
      const key = `test:seed:${Date.now()}`;
      const payload = { artist: 'Max Richter', score: 0.96 };

      qlooCacheRepo.set(key, payload, 3600);

      const t0 = performance.now();
      const cached = qlooCacheRepo.get<typeof payload>(key);
      const t1 = performance.now();

      expect(cached).toEqual(payload);
      expect(t1 - t0).toBeLessThan(5); // Ultra-fast sub-5ms retrieval
    });

    it('returns null and purges expired entries', async () => {
      const key = `test:expired:${Date.now()}`;
      qlooCacheRepo.set(key, { data: 'old' }, -1); // Already expired

      const cached = qlooCacheRepo.get(key);
      expect(cached).toBeNull();
    });

    it('reports accurate memory and sqlite entries in stats()', () => {
      const stats = qlooCacheRepo.stats();
      expect(typeof stats.memoryEntries).toBe('number');
      expect(typeof stats.sqliteEntries).toBe('number');
      expect(stats.sqliteEntries).toBeGreaterThanOrEqual(0);
    });
  });

  describe('REST Endpoints for Cache Diagnostics', () => {
    it('GET /api/cache/stats returns current cache telemetry', async () => {
      const res = await request(app).get('/api/cache/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.sqliteEntries).toBeDefined();
    });

    it('POST /api/cache/clear flushes expired entries cleanly', async () => {
      const res = await request(app).post('/api/cache/clear');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toBeDefined();
    });

    it('GET /api/health includes cache telemetry in health check', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.cache).toBeDefined();
      expect(res.body.cache.memoryEntries).toBeDefined();
    });
  });

  describe('Real-Time SSE Streaming Pipeline (/api/dossier/generate-stream)', () => {
    it('streams reasoning ticks via SSE for VIP principal', async () => {
      const res = await request(app)
        .post('/api/dossier/generate-stream')
        .send({
          vipId: 'vip_marcus_vance',
          budgetTier: 'executive_500',
          mode: 'qloo_grounded',
        })
        .expect('Content-Type', /text\/event-stream/)
        .expect(200);

      const raw = res.text;
      expect(raw).toContain('event: progress');
      expect(raw).toContain('event: complete');

      // Verify that reasoning trace steps are delivered in the SSE stream
      expect(raw).toContain('profile_analyzer');
      expect(raw).toContain('explore_cultural_taste');
      expect(raw).toContain('curate_proposals');
      expect(raw).toContain('compliance_guardrail');
    });

    it('supports GET /api/dossier/generate-stream with query parameters', async () => {
      const res = await request(app)
        .get('/api/dossier/generate-stream?vipId=vip_marcus_vance&budgetTier=standard_200')
        .expect('Content-Type', /text\/event-stream/)
        .expect(200);

      const raw = res.text;
      expect(raw).toContain('event: complete');
      expect(raw).toContain('"type":"complete"');
    });
  });
});
