import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
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

function loadLocalEnv(cwd) {
  const envFiles = ['.env.local', '.env'];
  const envRoots = [cwd, appRootDir];

  for (const envRoot of envRoots) {
    for (const envFile of envFiles) {
      const envPath = resolve(envRoot, envFile);
      if (!existsSync(envPath)) {
        continue;
      }

      const content = readFileSync(envPath, 'utf8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const entry = parseEnvLine(line);
        if (!entry) {
          continue;
        }

        if (process.env[entry.key] === undefined) {
          process.env[entry.key] = entry.value;
        }
      }
    }
  }
}

const args = process.argv.slice(2);
const command = args.shift();
const cwd = process.cwd();
loadLocalEnv(cwd);
const windowsExecutable = resolve(cwd, 'pocketbase.exe');
const unixExecutable = resolve(cwd, 'pocketbase');
const executable = process.platform === 'win32'
  ? (existsSync(windowsExecutable) ? windowsExecutable : unixExecutable)
  : (existsSync(unixExecutable) ? unixExecutable : windowsExecutable);

if (!existsSync(executable)) {
  console.error('PocketBase executable not found in the current directory.');
  process.exit(1);
}

if (command === 'snapshot') {
  mkdirSync(resolve(cwd, 'pb_snapshots'), { recursive: true });

  const result = spawnSync(executable, ['migrate', 'collections', ...args], {
    cwd,
    env: process.env,
    encoding: 'utf8',
    input: 'y\n',
    stdio: ['pipe', 'inherit', 'inherit'],
  });

  process.exit(result.status ?? 1);
}

if (!command) {
  console.error('No PocketBase command provided.');
  process.exit(1);
}

const result = spawnSync(executable, [command, ...args], {
  cwd,
  env: process.env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);