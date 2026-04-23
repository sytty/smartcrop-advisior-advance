import apiServerClient from '@/lib/apiServerClient.js';
import pb from '@/lib/pocketbaseClient.js';

function getAuthOptions(options = {}) {
  const token = pb.authStore.token;
  return {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

async function safeRequest(apiCall, fallback = null, context = '') {
  try {
    return await apiCall();
  } catch (error) {
    const isNetworkError = error?.status === 0 || error?.status === 408 || error?.message?.includes('Failed to fetch');
    if (isNetworkError) {
      console.warn(`[AdminAPI] ${context}: Backend unreachable, using fallback data.`, error?.message);
      return fallback;
    }

    throw error;
  }
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.set(key, String(value));
  });

  const output = query.toString();
  return output ? `?${output}` : '';
}

const adminApi = {
  async getOverview() {
    return safeRequest(
      async () => {
        const response = await apiServerClient.get('/admin/overview', getAuthOptions());
        return response.overview;
      },
      {
        users: { total: 0, farmers: 0, admins: 0 },
        operations: { fields: 0, crops: 0, activeAlerts: 0 },
        subsidy: { submitted: 0, underReview: 0, approved: 0, rejected: 0, paid: 0 },
        ml: { highConfidence: 0, lowConfidence: 0, highConfidenceRate: null, driftDetected: false, lastUpdated: null },
        services: {
          api: { status: 'degraded', env: 'unknown', version: 'unknown' },
          pocketbase: { status: 'degraded', latencyMs: null, url: '', authenticated: false },
        },
      },
      'getOverview',
    );
  },

  async getUsers({ q = '', page = 1, limit = 30 } = {}) {
    return safeRequest(
      async () => {
        const response = await apiServerClient.get(
          `/admin/users${buildQuery({ q, page, limit })}`,
          getAuthOptions(),
        );
        return {
          users: response.users || [],
          pagination: response.pagination || { page: 1, perPage: limit, totalItems: 0, totalPages: 1 },
        };
      },
      { users: [], pagination: { page: 1, perPage: limit, totalItems: 0, totalPages: 1 } },
      'getUsers',
    );
  },

  async updateUserRole(userId, role) {
    const response = await apiServerClient.request(`/admin/users/${userId}/role`, {
      ...getAuthOptions(),
      method: 'PATCH',
      body: { role },
    });

    return response.user;
  },

  async getSystemHealth() {
    return safeRequest(
      async () => {
        const response = await apiServerClient.get('/admin/system-health', getAuthOptions());
        return response.health;
      },
      {
        api: { status: 'degraded', env: 'unknown', version: 'unknown' },
        pocketbase: { status: 'degraded', latencyMs: null, url: '', authenticated: false, hasSuperuserCredentials: false },
      },
      'getSystemHealth',
    );
  },
};

export default adminApi;