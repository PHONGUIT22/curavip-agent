import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Environment loader for the monorepo.
 * Precedence (later wins): repo root `.env` → `backend-mcp/.env` → `$CWD/.env`.
 * Values are never logged; only boolean "configured" states are exposed.
 */
const candidateEnvFiles = [
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
];

const loaded = new Set<string>();
for (const file of candidateEnvFiles) {
  if (loaded.has(file) || !fs.existsSync(file)) continue;
  dotenv.config({ path: file, override: loaded.size > 0, quiet: true });
  loaded.add(file);
}

const PLACEHOLDER_PATTERN = /^(PASTE_|YOUR_|your_|changeme|<)/;

/** True when a variable holds a real value rather than an empty string or a template placeholder. */
export function isRealSecret(value: string | undefined): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && !PLACEHOLDER_PATTERN.test(trimmed) && !trimmed.includes('PASTE_');
}

function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const envConfig = {
  get PORT(): number {
    return readNumber(process.env.PORT ?? process.env.MCP_PORT, 3001);
  },
  get AWS_REGION(): string {
    return process.env.AWS_BEDROCK_REGION?.trim() || process.env.AWS_REGION?.trim() || 'us-east-1';
  },
  get BEDROCK_MODEL_ID(): string {
    return process.env.BEDROCK_MODEL_ID?.trim() || 'us.anthropic.claude-3-5-sonnet-20241022-v2:0';
  },
  get BEDROCK_TIMEOUT_MS(): number {
    return readNumber(process.env.BEDROCK_TIMEOUT_MS, 25000);
  },
  get QLOO_API_URL(): string {
    return (process.env.QLOO_API_URL?.trim() || 'https://hackathon.api.qloo.com').replace(/\/+$/, '');
  },
  get QLOO_TIMEOUT_MS(): number {
    return readNumber(process.env.QLOO_TIMEOUT_MS, 6000);
  },
  get POLLY_VOICE_ID(): string {
    return process.env.POLLY_VOICE_ID?.trim() || 'Matthew';
  },
  get CORS_ORIGINS(): string[] {
    const raw = process.env.CORS_ORIGINS?.trim();
    if (!raw) return ['*'];
    return raw
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  },
  get DB_PATH(): string | undefined {
    return process.env.CURAVIP_DB_PATH?.trim() || undefined;
  },
  get qlooConfigured(): boolean {
    return isRealSecret(process.env.QLOO_API_KEY);
  },
  get bedrockConfigured(): boolean {
    return isRealSecret(process.env.AWS_ACCESS_KEY_ID) && isRealSecret(process.env.AWS_SECRET_ACCESS_KEY);
  },
};
