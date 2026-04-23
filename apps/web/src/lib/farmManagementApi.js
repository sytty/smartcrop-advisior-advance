import apiServerClient from '@/lib/apiServerClient.js';
import pb from '@/lib/pocketbaseClient.js';

function buildQuery({ farmerId, scope } = {}) {
  const params = new URLSearchParams();

  if (farmerId) {
    params.set('farmerId', farmerId);
  }

  if (scope) {
    params.set('scope', scope);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

function normalizeListResponse(payload, key) {
  return payload?.[key] || [];
}

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

/**
 * Wraps an async API call with graceful degradation.
 * When the backend is unreachable (ECONNREFUSED, network error, timeout),
 * returns a fallback value instead of throwing, preventing frontend crashes.
 */
async function safeRequest(apiCall, fallback = null, context = '') {
  try {
    return await apiCall();
  } catch (error) {
    const isNetworkError = error?.status === 0 || error?.status === 408 || error?.message?.includes('Failed to fetch');
    if (isNetworkError) {
      console.warn(`[FarmAPI] ${context}: Backend unreachable, using fallback data.`, error?.message);
      return fallback;
    }
    // Re-throw non-network errors (auth failures, validation, etc.)
    throw error;
  }
}

const farmManagementApi = {
  async getFields({ farmerId, scope } = {}) {
    return safeRequest(
      async () => {
        const response = await apiServerClient.get(`/farm/fields${buildQuery({ farmerId, scope })}`, getAuthOptions());
        return normalizeListResponse(response, 'fields');
      },
      [],
      'getFields'
    );
  },

  async createField(payload) {
    const response = await apiServerClient.post('/farm/fields', payload, getAuthOptions());
    return response.field;
  },

  async updateField(fieldId, payload) {
    const response = await apiServerClient.put(`/farm/fields/${fieldId}`, payload, getAuthOptions());
    return response.field;
  },

  async deleteField(fieldId) {
    await apiServerClient.delete(`/farm/fields/${fieldId}`, getAuthOptions());
  },

  async getCrops({ farmerId, scope } = {}) {
    return safeRequest(
      async () => {
        const response = await apiServerClient.get(`/farm/crops${buildQuery({ farmerId, scope })}`, getAuthOptions());
        return normalizeListResponse(response, 'crops');
      },
      [],
      'getCrops'
    );
  },

  async createCrop(payload) {
    const response = await apiServerClient.post('/farm/crops', payload, getAuthOptions());
    return response.crop;
  },

  async updateCrop(cropId, payload) {
    const response = await apiServerClient.put(`/farm/crops/${cropId}`, payload, getAuthOptions());
    return response.crop;
  },

  async deleteCrop(cropId) {
    await apiServerClient.delete(`/farm/crops/${cropId}`, getAuthOptions());
  },

  async getProfile(userId) {
    return safeRequest(
      async () => {
        const response = await apiServerClient.get(`/farm/profile/${userId}`, getAuthOptions());
        return response.profile;
      },
      {},
      'getProfile'
    );
  },

  async updateProfile(userId, payload) {
    const response = await apiServerClient.put(`/farm/profile/${userId}`, payload, getAuthOptions());
    return response.profile;
  },

  async getPerformance({ farmerId, scope } = {}) {
    return safeRequest(
      async () => {
        const response = await apiServerClient.get(`/farm/performance${buildQuery({ farmerId, scope })}`, getAuthOptions());
        return response.performance;
      },
      { metrics: {}, score: 0 },
      'getPerformance'
    );
  },

  async calculatePh(payload) {
    const response = await apiServerClient.post('/farm/ph/calculate', payload, getAuthOptions());
    return response.result;
  },
};

export default farmManagementApi;