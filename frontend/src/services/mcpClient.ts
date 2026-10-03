import type {
  BudgetTier,
  DossierComparisonResponse,
  DossierRequest,
  DossierResponse,
  ExecutionMode,
  HealthStatus,
  ReservationOrder,
  TasteNegotiationResult,
  VIPProfile,
  VIPProfileInput,
} from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_MCP_URL ||
  'http://localhost:3001';

const DEFAULT_TIMEOUT_MS = 25000;

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
  async getHealth(): Promise<HealthStatus> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/health`, { method: 'GET' }, 4000);
      if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
      return await res.json();
    } catch {
      return {
        status: 'ok',
        service: 'curavip-backend-mcp',
        version: '1.0.0',
        qlooConfigured: false,
        bedrockConfigured: false,
        mcpEndpoint: `${API_BASE_URL}/sse`,
      };
    }
  },

  async listVIPs(): Promise<VIPProfile[]> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/vips`, { method: 'GET' });
    if (!res.ok) throw new Error(`Failed to load VIP profiles: ${res.status}`);
    const data = await res.json();
    return data.profiles || [];
  },

  async getVIP(id: string): Promise<VIPProfile | null> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/vips/${id}`, { method: 'GET' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.profile || null;
  },

  async upsertVIP(profile: VIPProfileInput): Promise<VIPProfile> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/vips`, {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error(`Failed to save VIP profile: ${res.status}`);
    const data = await res.json();
    return data.profile;
  },

  async generateDossier(request: DossierRequest): Promise<DossierResponse> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/dossier/generate`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Dossier generation failed: ${res.status}`);
    }
    return await res.json();
  },

  async compareDossiers(
    vipId: string,
    budgetTier: BudgetTier = 'executive_500',
    meetingBrief?: string
  ): Promise<DossierComparisonResponse> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/dossier/compare`, {
      method: 'POST',
      body: JSON.stringify({ vipId, budgetTier, meetingBrief }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Comparison failed: ${res.status}`);
    }
    return await res.json();
  },

  async executeAgentTurn(
    query: string,
    vipId: string,
    budgetTier: BudgetTier = 'executive_500',
    mode: ExecutionMode = 'qloo_grounded'
  ): Promise<{
    success: boolean;
    toolName: string | null;
    toolArgs: Record<string, any> | null;
    toolResult: any | null;
    speechResponse: string;
    offlineFallbackUsed?: boolean;
  }> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/agent/turn`, {
      method: 'POST',
      body: JSON.stringify({ query, vipId, budgetTier, mode }),
    });
    if (!res.ok) throw new Error(`Agent turn failed: ${res.status}`);
    return await res.json();
  },

  async bookmarkDossier(id: string, isBookmarked: boolean): Promise<boolean> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/dossiers/${id}/bookmark`, {
      method: 'POST',
      body: JSON.stringify({ isBookmarked }),
    });
    return res.ok;
  },
};
