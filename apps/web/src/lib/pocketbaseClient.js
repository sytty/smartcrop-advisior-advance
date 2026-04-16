import Pocketbase from 'pocketbase';
import runtimeConfig from './runtimeConfig.js';

function normalizePocketBaseError(error) {
  return {
    status: error?.status || 500,
    message: error?.response?.message || error?.message || 'PocketBase request failed',
    response: error?.response || null,
    originalError: error,
  };
}

async function checkPocketBaseBrowserHealth() {
  const startedAt = Date.now();
  const response = await fetch(`${runtimeConfig.pocketbaseUrl}/api/health`, {
    method: 'GET',
  });

  return {
    connected: response.ok,
    latencyMs: Date.now() - startedAt,
    url: runtimeConfig.pocketbaseUrl,
  };
}

const pocketbaseClient = new Pocketbase(runtimeConfig.pocketbaseUrl);

pocketbaseClient.autoCancellation(false);

export default pocketbaseClient;
export { pocketbaseClient, normalizePocketBaseError, checkPocketBaseBrowserHealth };
