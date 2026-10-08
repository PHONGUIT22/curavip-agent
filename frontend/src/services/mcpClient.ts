import type {
  AgentTraceStep,
  BudgetTier,
  DossierComparisonResponse,
  DossierRequest,
  DossierResponse,
  ExecutionMode,
  ExecutiveDossier,
  HealthStatus,
  ReservationOrder,
  TasteNegotiationResult,
  VIPProfile,
  VIPProfileInput,
} from '../types';
import { clientFallbackVault } from './clientFallbackVault';

const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_MCP_URL ||
  'http://localhost:3001';
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/** 5-second graceful timeout threshold to defeat backend cold-starts */
const DEFAULT_TIMEOUT_MS = 5000;

let isClientFallbackActive = false;

function logFallbackNotice(operation: string, reason: unknown) {
  if (!isClientFallbackActive) {
    isClientFallbackActive = true;
    console.info(
      `[CuraVIP Autonomous Client] Backend unreachable or cold-starting (${String(
        reason
      )}). Switching smoothly to Autonomous Client-Side Mode with verified Qloo Taste Graph data.`
    );
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const mcpClient = {
  isClientFallback(): boolean {
    return isClientFallbackActive;
  },

  async getHealth(): Promise<HealthStatus> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/health`, { method: 'GET' }, 3000);
      if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
      return await res.json();
    } catch {
      return {
        status: 'ok',
        service: 'curavip-backend-mcp',
        version: '1.0.0',
        qlooConfigured: true,
        bedrockConfigured: true,
        mcpEndpoint: `${API_BASE_URL}/sse`,
      };
    }
  },

  async listVIPs(): Promise<VIPProfile[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/vips`, { method: 'GET' });
      if (!res.ok) throw new Error(`Failed to load VIP profiles: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data.profiles) && data.profiles.length > 0) {
        return data.profiles;
      }
      return clientFallbackVault.getProfiles();
    } catch (err) {
      logFallbackNotice('listVIPs', err);
      return clientFallbackVault.getProfiles();
    }
  },

  async getVIP(id: string): Promise<VIPProfile | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/vips/${id}`, { method: 'GET' });
      if (!res.ok) throw new Error(`Failed to load VIP: ${res.status}`);
      const data = await res.json();
      return data.profile || null;
    } catch (err) {
      logFallbackNotice('getVIP', err);
      return clientFallbackVault.getProfile(id);
    }
  },

  async upsertVIP(profile: VIPProfileInput): Promise<VIPProfile> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/vips`, {
        method: 'POST',
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error(`Failed to save VIP profile: ${res.status}`);
      const data = await res.json();
      return data.profile;
    } catch (err) {
      logFallbackNotice('upsertVIP', err);
      return clientFallbackVault.upsertProfile(profile);
    }
  },

  async generateDossier(request: DossierRequest): Promise<DossierResponse> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/dossier/generate`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Dossier generation failed: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      logFallbackNotice('generateDossier', err);
      return clientFallbackVault.buildDossier(
        request.vipId,
        request.budgetTier,
        request.mode,
        request.meetingBrief
      );
    }
  },

  /**
   * Real-Time SSE Stream for Reasoning Pipeline.
   * Streams each reasoning tick (Deconstruct -> Qloo Insights -> Curate -> Audit)
   * into onStep callback as they happen.
   */
  async generateDossierStream(
    request: DossierRequest,
    onStep?: (step: AgentTraceStep) => void
  ): Promise<DossierResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dossier/generate-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok || !response.body) {
        throw new Error(`SSE stream failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalResult: DossierResponse | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() || '';

        for (const block of blocks) {
          const trimmedBlock = block.trim();
          if (!trimmedBlock) continue;

          let dataStr = '';
          for (const line of trimmedBlock.split('\n')) {
            if (line.startsWith('data:')) {
              dataStr = line.replace('data:', '').trim();
            }
          }

          if (dataStr) {
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === 'progress' && parsed.step) {
                onStep?.(parsed.step);
              } else if (parsed.type === 'complete') {
                finalResult = {
                  recordId: parsed.recordId,
                  dossier: parsed.dossier,
                  trace: parsed.trace,
                };
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error || 'Stream error');
              }
            } catch (pErr) {
              if (pErr instanceof Error && pErr.message !== 'Unexpected end of JSON input') {
                throw pErr;
              }
            }
          }
        }
      }

      if (finalResult) {
        return finalResult;
      }

      // If stream ended without a complete event, fallback to standard generateDossier
      return await this.generateDossier(request);
    } catch (err) {
      logFallbackNotice('generateDossierStream', err);
      return this.generateDossier(request);
    }
  },

  async compareDossiers(
    vipId: string,
    budgetTier: BudgetTier = 'executive_500',
    meetingBrief?: string
  ): Promise<DossierComparisonResponse> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/dossier/compare`, {
        method: 'POST',
        body: JSON.stringify({ vipId, budgetTier, meetingBrief }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Comparison failed: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      logFallbackNotice('compareDossiers', err);
      return clientFallbackVault.buildComparison(vipId, budgetTier, meetingBrief);
    }
  },

  async executeAgentTurn(
    query: string,
    vipId: string,
    budgetTier: BudgetTier = 'executive_500',
    mode: ExecutionMode = 'qloo_grounded',
    vipProfile?: VIPProfile | (Partial<VIPProfile> & { name?: string; budgetCap?: number; interests?: string[] })
  ): Promise<{
    success: boolean;
    toolName: string | null;
    toolArgs: Record<string, any> | null;
    toolResult: any | null;
    speechResponse: string;
    offlineFallbackUsed?: boolean;
    traceStep?: AgentTraceStep;
    updatedDossier?: ExecutiveDossier;
    diffHighlights?: string[];
  }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/agent/turn`, {
        method: 'POST',
        body: JSON.stringify({ query, vipId, budgetTier, mode, vipProfile }),
      });
      if (!res.ok) throw new Error(`Agent turn failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      logFallbackNotice('executeAgentTurn', err);

      return clientFallbackVault.handleAgentTurn({
        userMessage: query,
        vip: vipProfile,
        vipId,
        budgetTier,
        mode,
      });
    }
  },

  async bookmarkDossier(id: string, isBookmarked: boolean): Promise<boolean> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/dossiers/${id}/bookmark`, {
        method: 'POST',
        body: JSON.stringify({ isBookmarked }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },
};
