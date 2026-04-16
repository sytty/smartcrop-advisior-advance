import pb from './pocketbaseClient';

export const databaseValidator = {
  async validate() {
    const collections = [
      'users', 'voice_conversations', 'diagnoses', 'regional_alerts', 
      'audit_logs', 'model_metrics', 'subsidy_eligibility', 'subsidy_applications',
      'sync_queue', 'offline_cache', 'subsidy_documents', 'weather_data',
      'market_prices', 'yield_predictions', 'soil_health_data', 'treatment_costs',
      'farmer_performance', 'crop_data', 'water_usage'
    ];

    const report = {
      totalCollections: collections.length,
      accessible: 0,
      inaccessible: [],
      status: 'pending'
    };

    for (const collection of collections) {
      try {
        await pb.collection(collection).getList(1, 1, { $autoCancel: false });
        report.accessible++;
      } catch (e) {
        // 403 means it exists but we don't have access (which is fine for validation)
        // 404 means it doesn't exist
        if (e.status === 403 || e.status === 401) {
          report.accessible++;
        } else {
          report.inaccessible.push({ collection, error: e.message });
        }
      }
    }

    report.status = report.inaccessible.length === 0 ? 'healthy' : 'error';
    return report;
  }
};