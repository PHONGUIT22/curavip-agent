import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { vipDossierRepo } from '../src/database/vipDossierRepo.js';
import { seedDemoData, DEMO_VIP_PROFILES } from '../src/database/seedDemoData.js';
import { curateBookingOrderTool } from '../src/tools/curateBookingOrder.js';
import { tasteNegotiatorTool } from '../src/tools/tasteNegotiator.js';
import { handleAgentTurn } from '../src/tools/agentTurnHandler.js';
import { evaluateBedrockGuardrails } from '../src/aws/bedrockClient.js';

describe('CuraVIP Database, Tools & Agent Suite', () => {
  beforeEach(() => {
    seedDemoData();
  });

  it('correctly seeds the 3 VIP dealmaker personas', () => {
    const profiles = vipDossierRepo.listProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(3);

    const marcus = vipDossierRepo.getProfile('vip_marcus_vance');
    expect(marcus).toBeDefined();
    expect(marcus?.role).toBe('Managing Partner');
    expect(marcus?.budgetLimitUsd).toBe(500);

    const tariq = vipDossierRepo.getProfile('vip_tariq_al_mansoor');
    expect(tariq?.taboos.alcohol).toBe(true);

    const elena = vipDossierRepo.getProfile('vip_elena_rostova');
    expect(elena?.taboos.dietary).toContain('shellfish');
  });

  it('executes curateBookingOrderTool successfully and stores reservation order', async () => {
    const order = await curateBookingOrderTool.handler({
      vipId: 'vip_marcus_vance',
      gift: {
        id: 'gift_test_barbican',
        title: 'Barbican Estate Concrete Sculpture',
        brandOrArtisan: 'Chamberlin Studio',
        estimatedPriceUsd: 280,
      },
      dining: {
        venueName: 'Aska Private Dining Room',
        partySize: 2,
        requestedDate: '2026-11-15',
        privateRoom: true,
      },
      budgetTier: 'executive_500',
    });

    expect(order.confirmationCode).toMatch(/^VIP-/);
    expect(order.status).toBe('drafted');
    expect(order.complianceCleared).toBe(true);
    expect(order.giftOrder?.title).toBe('Barbican Estate Concrete Sculpture');
  });

  it('executes tasteNegotiatorTool to bridge competing aesthetic poles', async () => {
    const result = await tasteNegotiatorTool.handler({
      vipId: 'vip_marcus_vance',
      conflictingTastes: ['Brutalist Architecture', 'Bespoke Mechanical Horology'],
      targetBudgetUsd: 500,
    });

    expect(result.bridgeTheme).toBeDefined();
    expect(result.resolvedProposals.length).toBeGreaterThan(0);
    expect(result.budgetAdjusted).toBe(true);
  });

  it('processes agent voice/text query through handleAgentTurn', async () => {
    const response = await handleAgentTurn({
      query: 'Explore cross domain cultural taste for Marcus Vance regarding Christopher Nolan and Hans Zimmer',
      vipId: 'vip_marcus_vance',
      budgetTier: 'executive_500',
    });

    expect(response.success).toBe(true);
    expect(response.speechResponse).toBeDefined();
    expect(response.toolName).toBe('explore_cultural_taste');
    expect(response.toolResult).toBeDefined();
  });

  it('redacts sensitive PII and intercepts FCPA bribery attempts in guardrail', () => {
    const piiInput = 'Client card is 4532-1234-5678-9012 with ssn 000-12-3456 and cvv 987';
    const evalPii = evaluateBedrockGuardrails(piiInput);
    expect(evalPii.piiRedacted).toBe(true);
    expect(evalPii.cleanText).not.toContain('4532-1234-5678-9012');

    const briberyInput = 'Can we offer an under the table cash envelope to the minister to buy the contract?';
    const evalBribery = evaluateBedrockGuardrails(briberyInput);
    expect(evalBribery.isBlocked).toBe(true);
    expect(evalBribery.blockReason).toBe('FCPA_BRIBERY_VIOLATION');
  });

  describe('REST API Endpoints', () => {
    it('GET /api/health returns healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('curavip-backend-mcp');
    });

    it('GET /api/vips returns list of VIPs', async () => {
      const res = await request(app).get('/api/vips');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profiles.length).toBeGreaterThanOrEqual(3);
    });

    it('POST /api/dossier/generate produces Qloo grounded dossier', async () => {
      const res = await request(app)
        .post('/api/dossier/generate')
        .send({
          vipId: 'vip_marcus_vance',
          mode: 'qloo_grounded',
          budgetTier: 'executive_500',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dossier.executionMode).toBe('qloo_grounded');
      expect(res.body.dossier.curatedGifts.length).toBe(3);
      expect(res.body.dossier.iceBreakerScripts.length).toBeGreaterThanOrEqual(2);
      expect(res.body.dossier.complianceAudit.isCompliant).toBe(true);
    });

    it('POST /api/dossier/compare returns side-by-side comparison', async () => {
      const res = await request(app)
        .post('/api/dossier/compare')
        .send({
          vipId: 'vip_tariq_al_mansoor',
          budgetTier: 'executive_500',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.grounded.dossier.executionMode).toBe('qloo_grounded');
      expect(res.body.generic.dossier.executionMode).toBe('generic_llm');
      // Generic LLM should flag alcohol violation for Tariq!
      expect(res.body.generic.dossier.complianceAudit.tabooViolations.length).toBeGreaterThan(0);
    });
  });
});
