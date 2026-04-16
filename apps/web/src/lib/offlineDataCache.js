export const cacheFieldData = (data) => {
  try {
    localStorage.setItem('offline_field_data', JSON.stringify({
      data,
      timestamp: new Date().toISOString()
    }));
    return true;
  } catch (e) {
    console.error('Failed to cache field data', e);
    return false;
  }
};

export const getCachedFieldData = () => {
  try {
    const cached = localStorage.getItem('offline_field_data');
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
};

export const cacheDiagnosis = (data) => {
  try {
    const existing = getCachedDiagnoses() || [];
    localStorage.setItem('offline_diagnoses', JSON.stringify([
      { ...data, _localId: Date.now().toString(), timestamp: new Date().toISOString() },
      ...existing
    ]));
    return true;
  } catch (e) {
    console.error('Failed to cache diagnosis', e);
    return false;
  }
};

export const getCachedDiagnoses = () => {
  try {
    const cached = localStorage.getItem('offline_diagnoses');
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    return [];
  }
};

export const removeCachedDiagnosisByLocalId = (localId) => {
  try {
    const existing = getCachedDiagnoses();
    const updated = existing.filter((item) => item._localId !== localId);
    localStorage.setItem('offline_diagnoses', JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Failed to remove cached diagnosis', e);
    return false;
  }
};

export const cacheTreatment = (data) => {
  try {
    const existing = getCachedTreatments() || [];
    localStorage.setItem('offline_treatments', JSON.stringify([
      { ...data, _localId: Date.now().toString(), timestamp: new Date().toISOString() },
      ...existing
    ]));
    return true;
  } catch (e) {
    console.error('Failed to cache treatment', e);
    return false;
  }
};

export const getCachedTreatments = () => {
  try {
    const cached = localStorage.getItem('offline_treatments');
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    return [];
  }
};

export const clearAllCache = () => {
  try {
    localStorage.removeItem('offline_field_data');
    localStorage.removeItem('offline_diagnoses');
    localStorage.removeItem('offline_treatments');
    return true;
  } catch (e) {
    return false;
  }
};

export const getStorageUsage = () => {
  try {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('offline_')) {
        const value = localStorage.getItem(key);
        totalBytes += (key.length + value.length) * 2; // UTF-16 uses 2 bytes per char
      }
    }
    const usageMB = totalBytes / (1024 * 1024);
    const limitMB = 5; // Typical localStorage limit is ~5MB
    return {
      usageMB: parseFloat(usageMB.toFixed(2)),
      limitMB,
      percentage: Math.min(100, Math.round((usageMB / limitMB) * 100))
    };
  } catch (e) {
    return { usageMB: 0, limitMB: 5, percentage: 0 };
  }
};