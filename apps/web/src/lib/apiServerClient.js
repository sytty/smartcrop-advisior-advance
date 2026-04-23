import runtimeConfig from './runtimeConfig.js';

class ApiClientError extends Error {
  constructor(message, { status = 500, response = null, url = '' } = {}) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.response = response;
    this.url = url;
  }
}

function buildUrl(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${runtimeConfig.apiBaseUrl}${normalizedPath}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

async function request(path, options = {}) {
  const {
    timeoutMs = runtimeConfig.requestTimeoutMs,
    headers = {},
    body,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const url = buildUrl(path);

  const requestOptions = {
    ...fetchOptions,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    signal: options.signal || controller.signal,
  };

  if (body !== undefined) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    requestOptions.body = isFormData ? body : JSON.stringify(body);

    if (!isFormData) {
      requestOptions.headers = {
        'Content-Type': 'application/json',
        ...requestOptions.headers,
      };
    }
  }

  try {
    const response = await fetch(url, requestOptions);
    const payload = await parseResponse(response);

    if (!response.ok) {
      throw new ApiClientError(
        payload?.message || `API request failed with status ${response.status}`,
        {
          status: response.status,
          response: payload,
          url,
        },
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new ApiClientError(`API request timed out after ${timeoutMs}ms`, {
        status: 408,
        url,
      });
    }

    throw new ApiClientError(error.message || 'Failed to reach the API server', {
      status: 0,
      url,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

const apiServerClient = {
  buildUrl,
  fetch: (path, options = {}) => fetch(buildUrl(path), options),
  request,
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
  health: {
    check: () => request('/health', { method: 'GET' }),
    ready: () => request('/health/ready', { method: 'GET' }),
    pocketbase: () => request('/health/pocketbase', { method: 'GET' }),
  },
};

export default apiServerClient;
export { ApiClientError, apiServerClient };
