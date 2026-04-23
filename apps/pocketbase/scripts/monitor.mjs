#!/usr/bin/env node

/**
 * PocketBase Server Status & Monitoring Dashboard
 * Displays real-time health metrics and performance statistics
 */

import fetch from 'node-fetch';
import os from 'os';

const POCKETBASE_URL = process.env.PB_BASE_URL || 'http://127.0.0.1:8090';
const API_URL = process.env.API_URL || 'http://127.0.0.1:3001';
const CHECK_INTERVAL = 10000; // Check every 10 seconds

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

function printHeader() {
  console.clear();
  console.log(colorize('╔════════════════════════════════════════════════════════╗', colors.cyan));
  console.log(colorize('║   PocketBase Server - Production Monitoring Dashboard   ║', colors.cyan));
  console.log(colorize('║         Horizons Smart Agriculture Platform            ║', colors.cyan));
  console.log(colorize('╚════════════════════════════════════════════════════════╝', colors.cyan));
  console.log('');
}

async function checkHealth(url, name) {
  try {
    const startTime = Date.now();
    const response = await fetch(`${url}/api/health`, { 
      timeout: 5000,
      method: 'GET',
    });
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      return {
        name,
        status: 'HEALTHY',
        statusCode: response.status,
        latency,
        color: colors.green,
      };
    } else {
      return {
        name,
        status: 'UNHEALTHY',
        statusCode: response.status,
        latency,
        color: colors.red,
      };
    }
  } catch (error) {
    return {
      name,
      status: 'DOWN',
      statusCode: 0,
      latency: 0,
      color: colors.red,
      error: error.message,
    };
  }
}

function getSystemMetrics() {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryPercent = ((usedMemory / totalMemory) * 100).toFixed(2);
  const loadAverage = os.loadavg();
  const uptime = process.uptime();

  return {
    cpus: cpus.length,
    cpuModel: cpus[0].model,
    totalMemory: (totalMemory / 1024 / 1024 / 1024).toFixed(2),
    usedMemory: (usedMemory / 1024 / 1024 / 1024).toFixed(2),
    freeMemory: (freeMemory / 1024 / 1024 / 1024).toFixed(2),
    memoryPercent,
    loadAverage: loadAverage.map(l => l.toFixed(2)),
    uptime: Math.floor(uptime),
  };
}

function printSystemInfo() {
  const metrics = getSystemMetrics();
  
  console.log(colorize('📊 SYSTEM METRICS', colors.bright));
  console.log('─'.repeat(60));
  console.log(`  CPU Cores:        ${metrics.cpus}`);
  console.log(`  CPU Model:        ${metrics.cpuModel}`);
  console.log(`  Total Memory:     ${metrics.totalMemory} GB`);
  console.log(`  Used Memory:      ${metrics.usedMemory} GB (${metrics.memoryPercent}%)`);
  console.log(`  Free Memory:      ${metrics.freeMemory} GB`);
  console.log(`  Load Average:     ${metrics.loadAverage.join(', ')}`);
  console.log(`  Process Uptime:   ${Math.floor(metrics.uptime / 60)} min`);
  console.log('');
}

function printStatusLine(health) {
  const statusIcon = health.status === 'HEALTHY' ? '✅' : health.status === 'UNHEALTHY' ? '⚠️' : '❌';
  const latencyStr = health.latency ? `(${health.latency}ms)` : '';
  const statusStr = colorize(`${health.status} ${latencyStr}`.padEnd(30), health.color);
  
  console.log(`  ${statusIcon} ${health.name.padEnd(20)} → ${statusStr}`);
}

async function displayDashboard() {
  printHeader();
  printSystemInfo();

  console.log(colorize('🔍 SERVICE HEALTH CHECK', colors.bright));
  console.log('─'.repeat(60));

  const services = [
    { url: POCKETBASE_URL, name: 'PocketBase' },
    { url: API_URL, name: 'API Server' },
  ];

  const healthChecks = await Promise.all(
    services.map(s => checkHealth(s.url, s.name))
  );

  healthChecks.forEach(printStatusLine);
  console.log('');

  console.log(colorize('📍 ACCESS POINTS', colors.bright));
  console.log('─'.repeat(60));
  console.log(`  🌐 PocketBase:     ${POCKETBASE_URL}`);
  console.log(`  🌐 Dashboard:      ${POCKETBASE_URL}/_/`);
  console.log(`  🌐 API Server:     ${API_URL}`);
  console.log('');

  console.log(colorize('🔐 CREDENTIALS', colors.bright));
  console.log('─'.repeat(60));
  console.log(`  Admin Email:       horizons-admin@production.dev`);
  console.log(`  Admin Password:    SecureHorizons2026!Admin@Production`);
  console.log('');

  console.log(colorize('⏰ Last Updated: ' + new Date().toLocaleTimeString(), colors.yellow));
  console.log(colorize('Press Ctrl+C to exit', colors.yellow));
}

async function start() {
  displayDashboard();
  
  setInterval(displayDashboard, CHECK_INTERVAL);
}

start().catch(error => {
  console.error('Error starting monitor:', error);
  process.exit(1);
});
