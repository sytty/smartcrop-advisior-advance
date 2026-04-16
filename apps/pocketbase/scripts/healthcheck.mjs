import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRootDir = resolve(scriptDir, '..');

function stripWrappingQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const powershellMatch = trimmed.match(/^\$env:([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);?$/);
  if (powershellMatch) {
    return {
      key: powershellMatch[1],
      value: stripWrappingQuotes(powershellMatch[2]),
    };
  }

  const dotenvMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (dotenvMatch) {
    return {
      key: dotenvMatch[1],
      value: stripWrappingQuotes(dotenvMatch[2]),
    };
  }

  return null;
}

function loadLocalEnv() {
  const envFiles = ['.env.local', '.env'];
  const envRoots = [appRootDir, resolve(appRootDir, '..', '..')];

  for (const envRoot of envRoots) {
    for (const envFile of envFiles) {
      const envPath = resolve(envRoot, envFile);
      if (!existsSync(envPath)) {
        continue;
      }

      const content = readFileSync(envPath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const entry = parseEnvLine(line);
        if (entry && process.env[entry.key] === undefined) {
          process.env[entry.key] = entry.value;
        }
      }
    }
  }
}

loadLocalEnv();

const baseUrl = (process.env.PB_BASE_URL || process.env.POCKETBASE_URL || 'http://127.0.0.1:8090').replace(/\/+$/, '');
const startedAt = Date.now();

try {
  const response = await fetch(`${baseUrl}/api/health`, { method: 'GET' });

  if (!response.ok) {
    console.error(`PocketBase health check failed with status ${response.status}`);
    process.exit(1);
  }

  console.log(`PocketBase healthy at ${baseUrl} (${Date.now() - startedAt}ms)`);
} catch (error) {
  console.error(`PocketBase health check failed: ${error.message}`);
  process.exit(1);
}
