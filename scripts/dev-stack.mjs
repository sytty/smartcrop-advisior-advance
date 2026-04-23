import { spawn } from 'node:child_process';
import os from 'node:os';

const npmExecPath = process.env.npm_execpath;
const isWindows = process.platform === 'win32';

function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const services = [
  {
    name: 'pocketbase',
    args: ['run', 'dev', '--prefix', 'apps/pocketbase'],
    healthUrl: 'http://127.0.0.1:8090/api/health',
  },
  {
    name: 'api',
    args: ['run', 'dev', '--prefix', 'apps/api'],
    healthUrl: 'http://127.0.0.1:3001/health/pocketbase',
  },
  {
    name: 'web',
    args: ['run', 'dev', '--prefix', 'apps/web'],
    healthUrl: 'http://127.0.0.1:3000',
  },
];

const children = [];
let shuttingDown = false;

function startService(service) {
  // On Windows, use shell:true to avoid spawn EINVAL errors.
  // `shell:true` lets Windows resolve .cmd/.bat wrappers (like npm.cmd) correctly.
  const command = npmExecPath ? process.execPath : 'npm';
  const args = npmExecPath ? [npmExecPath, ...service.args] : service.args;

  const child = spawn(command, args, {
    cwd: process.cwd(),
    shell: isWindows,
    stdio: 'inherit',
    env: process.env,
  });

  child.on('error', (err) => {
    console.error(`\n[${service.name}] failed to start: ${err.message}`);
  });

  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      console.error(`\n[${service.name}] exited with code ${code}. Stopping all services...`);
      shutdown(code ?? 1);
    }
  });

  children.push(child);
}

async function checkHealth(url) {
  try {
    const response = await fetch(url, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}

async function printHealthSummary() {
  const checks = await Promise.all(
    services.map(async (service) => ({
      name: service.name,
      url: service.healthUrl,
      ok: await checkHealth(service.healthUrl),
    })),
  );

  const allHealthy = checks.every((check) => check.ok);
  const timestamp = new Date().toLocaleTimeString();
  const networkIP = getNetworkIP();

  console.log('\n=== Dev Stack Health ===');
  console.log(`Time: ${timestamp}`);
  for (const check of checks) {
    const status = check.ok ? 'OK' : 'DOWN';
    console.log(`- ${check.name}: ${status} (${check.url})`);
  }
  console.log(allHealthy ? 'Overall: HEALTHY' : 'Overall: STARTING/DEGRADED');
  console.log('========================\n');

  if (allHealthy) {
    console.log('📌 BACKEND ACCESS POINTS:');
    console.log('─────────────────────────────────────');
    console.log(`🌐 PocketBase (Local):   http://127.0.0.1:8090`);
    console.log(`🌐 PocketBase (Network): http://${networkIP}:8090`);
    console.log(`   Dashboard: http://${networkIP}:8090/_/`);
    console.log('');
    console.log(`🔌 API Server (Local):   http://127.0.0.1:3001`);
    console.log(`🔌 API Server (Network): http://${networkIP}:3001`);
    console.log('');
    console.log(`💻 Web App (Local):      http://127.0.0.1:3000`);
    console.log(`💻 Web App (Network):    http://${networkIP}:3000`);
    console.log('─────────────────────────────────────\n');
  }

  return allHealthy;
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      // On Windows, SIGTERM doesn't work; use taskkill via child.kill()
      try {
        child.kill();
      } catch {
        // ignore
      }
    }
  }

  setTimeout(() => process.exit(exitCode), 200);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

for (const service of services) {
  // eslint-disable-next-line no-await-in-loop
  const alreadyRunning = await checkHealth(service.healthUrl);
  if (alreadyRunning) {
    console.log(`[launcher] ${service.name} already running (${service.healthUrl}), skipping start.`);
    continue;
  }

  console.log(`[launcher] starting ${service.name}...`);
  startService(service);
}

let summaryPrintedAsHealthy = false;

const interval = setInterval(async () => {
  const healthy = await printHealthSummary();
  if (healthy && !summaryPrintedAsHealthy) {
    summaryPrintedAsHealthy = true;
    console.log('All services are reachable. Press Ctrl+C to stop all.\n');
  }
}, 5000);

process.on('exit', () => clearInterval(interval));
