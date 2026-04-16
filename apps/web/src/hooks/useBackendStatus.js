import { useCallback, useEffect, useState } from 'react';
import apiServerClient from '@/lib/apiServerClient.js';
import { checkPocketBaseBrowserHealth } from '@/lib/pocketbaseClient.js';
import runtimeConfig from '@/lib/runtimeConfig.js';
import { logger } from '@/lib/logger.js';

const initialStatus = {
  state: 'checking',
  latencyMs: null,
  checkedAt: null,
  error: null,
};

function toHealthyStatus(payload = {}) {
  return {
    state: payload.status === 'degraded' ? 'degraded' : 'healthy',
    latencyMs: payload?.pocketbase?.latencyMs ?? payload?.latencyMs ?? null,
    checkedAt: new Date().toISOString(),
    error: null,
  };
}

function toErrorStatus(error) {
  return {
    state: 'offline',
    latencyMs: null,
    checkedAt: new Date().toISOString(),
    error: error?.message || 'Service unavailable',
  };
}

export function useBackendStatus({ enabled = true, intervalMs = runtimeConfig.backendStatusPollMs } = {}) {
  const [apiStatus, setApiStatus] = useState(initialStatus);
  const [pocketbaseStatus, setPocketbaseStatus] = useState(initialStatus);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setIsRefreshing(true);
    try {
      const [apiResult, pocketbaseApiResult, pocketbaseDirectResult] = await Promise.allSettled([
        apiServerClient.health.check(),
        apiServerClient.health.pocketbase(),
        checkPocketBaseBrowserHealth(),
      ]);

      if (apiResult.status === 'fulfilled') {
        setApiStatus(toHealthyStatus(apiResult.value));
      } else {
        logger.warn('API health check failed', apiResult.reason);
        setApiStatus(toErrorStatus(apiResult.reason));
      }

      if (pocketbaseApiResult.status === 'fulfilled') {
        setPocketbaseStatus(toHealthyStatus(pocketbaseApiResult.value));
      } else if (pocketbaseDirectResult.status === 'fulfilled') {
        setPocketbaseStatus({
          state: pocketbaseDirectResult.value.connected ? 'healthy' : 'degraded',
          latencyMs: pocketbaseDirectResult.value.latencyMs,
          checkedAt: new Date().toISOString(),
          error: null,
        });
      } else {
        logger.warn('PocketBase health check failed', pocketbaseApiResult.reason || pocketbaseDirectResult.reason);
        setPocketbaseStatus(toErrorStatus(pocketbaseApiResult.reason || pocketbaseDirectResult.reason));
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setApiStatus(initialStatus);
      setPocketbaseStatus(initialStatus);
      return undefined;
    }

    refresh().catch((error) => {
      logger.error('Backend status refresh failed', error);
    });

    const intervalId = window.setInterval(() => {
      refresh().catch((error) => {
        logger.error('Background backend status refresh failed', error);
      });
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, intervalMs, refresh]);

  return {
    apiStatus,
    pocketbaseStatus,
    isRefreshing,
    refresh,
    allSystemsOperational:
      apiStatus.state === 'healthy' && pocketbaseStatus.state === 'healthy',
  };
}

export default useBackendStatus;
