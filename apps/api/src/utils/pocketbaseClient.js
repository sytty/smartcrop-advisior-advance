import Pocketbase from 'pocketbase';
import apiConfig from '../config/env.js';
import logger from './logger.js';

async function waitForHealth({ retries = 10, delayMs = 1000 } = {}) {
    for (let i = 1; i <= retries; i++) {
        try {
            const response = await fetch(`${apiConfig.pocketbase.baseUrl}/api/health`, { method: 'GET' });
            if (response.ok) {
                return;
            }
        } catch {
            // Keep retrying until PocketBase is ready.
        }

        logger.warn(`PocketBase not ready, retrying (${i}/${retries})...`);

        await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error(`PocketBase health check failed after ${retries} retries`);
}

const pocketbaseClient = new Pocketbase(apiConfig.pocketbase.baseUrl);

pocketbaseClient.autoCancellation(false);

let authPromise = null;

async function ensureSuperuserAuth() {
    const email = apiConfig.pocketbase.superuserEmail;
    const password = apiConfig.pocketbase.superuserPassword;

    if (!email || !password) {
        return false;
    }

    if (pocketbaseClient.authStore.isValid) {
        return true;
    }

    if (!authPromise) {
        authPromise = pocketbaseClient.collection('_superusers').authWithPassword(
            email,
            password,
        ).finally(() => {
            authPromise = null;
        });
    }

    await authPromise;
    return pocketbaseClient.authStore.isValid;
}

pocketbaseClient.beforeSend = async function (url, options) {
    if (url.includes('/api/collections/_superusers/auth-with-password')) {
        return { url, options };
    }

    await ensureSuperuserAuth();

    options.headers = options.headers || {};

    return { url, options };
};

async function checkPocketBaseHealth() {
    const startedAt = Date.now();
    const response = await fetch(`${apiConfig.pocketbase.baseUrl}/api/health`, { method: 'GET' });

    return {
        connected: response.ok,
        latencyMs: Date.now() - startedAt,
        url: apiConfig.pocketbase.baseUrl,
        authenticated: pocketbaseClient.authStore.isValid,
        hasSuperuserCredentials: Boolean(
            apiConfig.pocketbase.superuserEmail && apiConfig.pocketbase.superuserPassword,
        ),
    };
}

function getPocketBaseRuntimeState() {
    return {
        baseUrl: apiConfig.pocketbase.baseUrl,
        authenticated: pocketbaseClient.authStore.isValid,
        hasSuperuserCredentials: Boolean(
            apiConfig.pocketbase.superuserEmail && apiConfig.pocketbase.superuserPassword,
        ),
    };
}

(async () => {
    try {
        await waitForHealth({
            retries: apiConfig.pocketbase.healthRetries,
            delayMs: apiConfig.pocketbase.healthDelayMs,
        });

        const hasCredentials = apiConfig.pocketbase.superuserEmail && apiConfig.pocketbase.superuserPassword;
        if (hasCredentials) {
            await ensureSuperuserAuth();
        } else {
            logger.warn('PB_SUPERUSER_EMAIL/PB_SUPERUSER_PASSWORD not set. API will run without superuser auth.');
        }

        logger.info('PocketBase client initialized successfully');
    } catch (err) {
        logger.warn('PocketBase client not ready at startup. API will keep running and retry on demand.', err?.message || err);
    }
})();

export default pocketbaseClient;
export { pocketbaseClient, checkPocketBaseHealth, ensureSuperuserAuth, getPocketBaseRuntimeState };
