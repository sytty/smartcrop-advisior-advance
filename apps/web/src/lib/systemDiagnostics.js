import pb from './pocketbaseClient';
import i18n from '../i18n/config';

export const runDiagnostics = async () => {
  const report = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    components: {
      i18n: { status: 'pending', details: null },
      database: { status: 'pending', details: null },
      network: { status: 'pending', details: null },
      performance: { status: 'pending', details: null }
    }
  };

  // 1. i18n Validation
  try {
    const languages = ['en', 'es', 'hi', 'pt', 'sw', 'mr', 'fr', 'de', 'it', 'ja', 'zh', 'ko', 'ru', 'ar', 'tr', 'vi'];
    const namespaces = ['common', 'nav', 'auth', 'dashboard', 'footer', 'analytics', 'monitoring', 'intelligence', 'admin', 'enterprise', 'futuristic'];
    
    let missingKeys = 0;
    const langStatus = {};

    languages.forEach(lang => {
      const resources = i18n.store.data[lang]?.translation || {};
      const hasAllNamespaces = namespaces.every(ns => !!resources[ns]);
      if (!hasAllNamespaces) missingKeys++;
      langStatus[lang] = hasAllNamespaces ? 'ok' : 'incomplete';
    });

    report.components.i18n = {
      status: missingKeys === 0 ? 'healthy' : 'warning',
      details: { languagesChecked: languages.length, missingKeys, langStatus }
    };
  } catch (e) {
    report.components.i18n = { status: 'error', details: e.message };
  }

  // 2. Database Validation
  try {
    const collections = [
      'users', 'voice_conversations', 'diagnoses', 'regional_alerts', 
      'audit_logs', 'model_metrics', 'subsidy_eligibility', 'subsidy_applications',
      'sync_queue', 'offline_cache', 'subsidy_documents', 'weather_data',
      'market_prices', 'yield_predictions', 'soil_health_data', 'treatment_costs',
      'farmer_performance', 'crop_data', 'water_usage'
    ];

    const dbResults = await Promise.allSettled(
      collections.map(c => pb.collection(c).getList(1, 1, { $autoCancel: false }))
    );

    const accessible = dbResults.filter(r => r.status === 'fulfilled' || (r.status === 'rejected' && r.reason.status === 403)).length;
    
    report.components.database = {
      status: accessible === collections.length ? 'healthy' : 'warning',
      details: { collectionsChecked: collections.length, accessible }
    };
  } catch (e) {
    report.components.database = { status: 'error', details: e.message };
  }

  // 3. Network & Performance (Basic)
  report.components.network = {
    status: navigator.onLine ? 'healthy' : 'error',
    details: { online: navigator.onLine, connection: navigator.connection?.effectiveType || 'unknown' }
  };

  if (window.performance) {
    const memory = performance.memory || {};
    report.components.performance = {
      status: memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9 ? 'warning' : 'healthy',
      details: {
        memoryUsed: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        memoryLimit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
      }
    };
  }

  report.status = Object.values(report.components).some(c => c.status === 'error') ? 'error' : 
                  Object.values(report.components).some(c => c.status === 'warning') ? 'warning' : 'healthy';

  return report;
};