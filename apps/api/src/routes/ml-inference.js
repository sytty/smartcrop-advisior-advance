import { Router } from 'express';
import apiConfig from '../config/env.js';
import { infer } from '../utils/ml-inference.js';
import logger from '../utils/logger.js';

export default () => {
  const router = Router();

  router.get('/ml/features', (req, res) => {
    res.json({
      status: 'ok',
      features: [
        'ai_crop_advisor',
        'crop_disease_detector',
        'ai_pest_management',
        'predictive_weather',
        'voice_assistant',
        'yield_prediction_analytics',
        'soil_health_analytics',
        'weather_impact_analytics',
        'water_usage_optimization',
        'cost_benefit_analysis',
        'crop_comparison_analytics',
        'subsidy_verification',
      ],
      modelVersion: 'horizons-ml-v1',
    });
  });

  router.get('/ml/status', (req, res) => {
    res.json({
      status: 'ok',
      ml: {
        enabled: apiConfig.ml.enabled,
        providerUrl: apiConfig.ml.providerUrl || null,
        hasApiKey: Boolean(apiConfig.ml.providerApiKey),
        timeoutMs: apiConfig.ml.timeoutMs,
      },
    });
  });

  router.post('/ml/inference', async (req, res, next) => {
    try {
      const feature = String(req.body?.feature || '').trim();
      const payload = req.body?.payload && typeof req.body.payload === 'object' ? req.body.payload : {};

      if (!feature) {
        res.status(400).json({
          status: 'error',
          message: 'feature is required',
        });
        return;
      }

      const data = await infer(feature, payload);

      logger.info('ML inference request completed', {
        requestId: req.context?.requestId,
        feature,
      });

      res.json({
        status: 'ok',
        feature,
        modelVersion: data?._meta?.modelVersion || 'horizons-ml-v1',
        source: data?._meta?.source || 'local-fallback',
        confidence: typeof data?.confidence === 'number' ? data.confidence : undefined,
        data,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
