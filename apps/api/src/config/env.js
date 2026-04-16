import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPaths = [
  resolve(__dirname, '../../.env'),
  resolve(__dirname, '../../.env.local'),
  resolve(__dirname, '../../../.env'),
  resolve(__dirname, '../../../pocketbase/.env'),
];

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

dotenv.config();

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoolean(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

function parseCorsOrigins(value) {
  if (!value) {
    return [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://[::1]:3000',
    ];
  }

  if (value.trim() === '*') {
    return '*';
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const nodeEnv = process.env.NODE_ENV || 'development';

const apiConfig = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv !== 'production',
  port: parseInteger(process.env.PORT, 3001),
  bodyLimit: process.env.API_BODY_LIMIT || '1mb',
  trustProxy: parseBoolean(process.env.TRUST_PROXY, false),
  logLevel: process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug'),
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
  version: process.env.npm_package_version || '0.0.0',
  rateLimit: {
    windowMs: parseInteger(process.env.RATE_LIMIT_WINDOW_MS, 5 * 60 * 1000),
    maxRequests: parseInteger(process.env.RATE_LIMIT_MAX, 100),
  },
  pocketbase: {
    baseUrl: (process.env.PB_BASE_URL || process.env.POCKETBASE_URL || 'http://127.0.0.1:8090').replace(/\/+$/, ''),
    healthRetries: parseInteger(process.env.PB_HEALTH_RETRIES, 10),
    healthDelayMs: parseInteger(process.env.PB_HEALTH_DELAY_MS, 1000),
    superuserEmail: process.env.PB_SUPERUSER_EMAIL || '',
    superuserPassword: process.env.PB_SUPERUSER_PASSWORD || '',
  },
};

function getPublicApiConfig() {
  return {
    nodeEnv: apiConfig.nodeEnv,
    version: apiConfig.version,
    port: apiConfig.port,
    corsOrigins: apiConfig.corsOrigins === '*' ? '*' : [...apiConfig.corsOrigins],
    rateLimit: { ...apiConfig.rateLimit },
    pocketbase: {
      baseUrl: apiConfig.pocketbase.baseUrl,
      hasSuperuserCredentials: Boolean(
        apiConfig.pocketbase.superuserEmail && apiConfig.pocketbase.superuserPassword,
      ),
    },
  };
}

export default apiConfig;
export { apiConfig, getPublicApiConfig, parseBoolean, parseCorsOrigins };
