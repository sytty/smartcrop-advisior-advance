function normalizeBaseUrl(value, fallback) {
  const input = value || fallback;
  return input.replace(/\/+$/, '');
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const runtimeConfig = {
  apiBaseUrl: normalizeBaseUrl(
    import.meta.env.VITE_API_URL || import.meta.env.VITE_API_SERVER_URL,
    '/hcgi/api',
  ),
  pocketbaseUrl: normalizeBaseUrl(
    import.meta.env.VITE_POCKETBASE_URL,
    'http://127.0.0.1:8090',
  ),
  requestTimeoutMs: parseInteger(import.meta.env.VITE_REQUEST_TIMEOUT_MS, 8000),
  backendStatusPollMs: parseInteger(import.meta.env.VITE_BACKEND_STATUS_POLL_MS, 30000),
};

export default runtimeConfig;
export { runtimeConfig };
