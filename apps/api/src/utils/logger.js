import apiConfig from '../config/env.js';

const levelWeights = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

function normalizePayload(value) {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  return value;
}

function shouldLog(level) {
  const configuredLevel = apiConfig.logLevel in levelWeights ? apiConfig.logLevel : 'info';
  return levelWeights[level] >= levelWeights[configuredLevel];
}

function write(level, message, meta) {
  if (!shouldLog(level)) {
    return;
  }

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const consoleMethod = levelWeights[level] >= levelWeights.error ? console.error : console.log;

  if (meta === undefined) {
    consoleMethod(`${prefix} ${message}`);
    return;
  }

  consoleMethod(`${prefix} ${message}`, normalizePayload(meta));
}

const logger = {
  error: (message, meta) => write('error', message, meta),
  fatal: (message, meta) => write('fatal', message, meta),
  info: (message, meta) => write('info', message, meta),
  debug: (message, meta) => write('debug', message, meta),
  warn: (message, meta) => write('warn', message, meta),
};

export default logger;
export { logger };
