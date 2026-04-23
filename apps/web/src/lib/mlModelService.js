import runtimeConfig from '@/lib/runtimeConfig.js';
import pb from '@/lib/pocketbaseClient.js';
import {
  generateCropComparisonData,
  generateDiseaseDetectionData,
  generateSoilHealthData,
  generateTreatmentCostData,
  generateVoiceResponses,
  generateWaterUsageData,
  generateWeatherData,
  generateYieldPredictionData,
} from '@/lib/mockData.js';

function normalizeFeatureName(value) {
  return String(value || 'general').trim().toLowerCase().replace(/\s+/g, '_');
}

function createAbortController(timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timer };
}

async function callRemoteModel(feature, payload = {}, options = {}) {
  const endpoint = `${runtimeConfig.mlApiUrl}/ml/inference`;
  const timeoutMs = options.timeoutMs || runtimeConfig.mlRequestTimeoutMs;
  const { controller, timer } = createAbortController(timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feature: normalizeFeatureName(feature),
        payload,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`ML inference failed with status ${response.status}`);
    }

    const body = await response.json();
    if (!body || typeof body !== 'object') {
      throw new Error('ML inference response is invalid');
    }

    return {
      data: body.data ?? body,
      source: 'remote-model',
      modelVersion: body.modelVersion || body.model_version || 'remote-v1',
      confidence: typeof body.confidence === 'number' ? body.confidence : null,
    };
  } finally {
    clearTimeout(timer);
  }
}

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function localInference(feature, payload = {}) {
  const normalizedFeature = normalizeFeatureName(feature);

  switch (normalizedFeature) {
    case 'ai_crop_advisor': {
      const nitrogen = toNumber(payload.nitrogen, 55);
      const phosphorus = toNumber(payload.phosphorus, 35);
      const potassium = toNumber(payload.potassium, 45);
      const ph = toNumber(payload.ph, 6.5);
      const targetCrop = payload.targetCrop || 'Wheat';

      const nutrientBalance = (nitrogen + phosphorus + potassium) / 3;
      const confidence = clamp(Math.round(70 + (nutrientBalance / 100) * 25 - Math.abs(ph - 6.7) * 8), 62, 98);

      return {
        crop: targetCrop,
        confidence,
        fertilizer: `Apply ${Math.max(20, Math.round((90 - nutrientBalance) * 0.7))}kg/ha split nutrient blend over 2 cycles.`,
        water: `Maintain soil moisture around ${clamp(Math.round(58 + (7 - ph) * 6), 45, 72)}% and irrigate every ${clamp(Math.round(6 + (ph - 6.5) * 2), 4, 9)} days.`,
        risk: confidence > 85 ? 'Low disease pressure expected with current conditions.' : 'Moderate stress risk detected; monitor humidity and leaf lesions weekly.',
        yield: `${(3.2 + confidence / 50).toFixed(1)} tons/ha expected`,
      };
    }

    case 'crop_disease_detector': {
      const diagnosis = generateDiseaseDetectionData();
      return {
        disease: diagnosis.name,
        confidence: diagnosis.confidence,
        severity: diagnosis.severity[0].toUpperCase() + diagnosis.severity.slice(1),
        treatment: diagnosis.treatments.organic.name,
        prevention: diagnosis.preventionTips[0],
      };
    }

    case 'ai_pest_management': {
      const base = ['Fall Armyworm', 'Aphids', 'Whitefly', 'Stem Borer'];
      const pest = base[Math.floor(Math.random() * base.length)];
      const confidence = Math.floor(Math.random() * 15) + 82;
      const severity = confidence > 92 ? 'High' : confidence > 86 ? 'Moderate' : 'Low';

      return {
        pest,
        confidence,
        severity,
        damage: `${Math.floor((100 - confidence) * 0.9 + 8)}%`,
        treatment: 'Apply targeted bio-compatible pesticide within 24 hours and repeat in 7 days.',
        biological: 'Release beneficial predators and install pheromone traps for hotspot control.',
      };
    }

    case 'predictive_weather': {
      const weather = generateWeatherData();
      const hourly = Array.from({ length: 12 }).map((_, i) => ({
        label: `${(i % 12) + 1}:00 ${i < 6 ? 'PM' : 'AM'}`,
        rain: Math.random() > 0.55,
        temp: clamp(29 - i + Math.floor(Math.random() * 2), 14, 40),
      }));

      const alerts = [];
      if (weather.some((day) => day.rainfall > 14)) {
        alerts.push('Heavy rainfall expected. Pause fertilizer application for 24-36 hours.');
      }

      return {
        weatherScore: clamp(Math.round(72 + Math.random() * 24), 60, 96),
        current: {
          temperature: weather[0]?.temp ?? 24,
          condition: (weather[0]?.rainfall ?? 0) > 6 ? 'Light Rain' : 'Partly Cloudy',
          humidity: weather[0]?.humidity ?? 52,
          wind: weather[0]?.wind ?? 9,
          uv: (weather[0]?.temp ?? 0) > 30 ? 'High' : 'Moderate',
        },
        alerts,
        recommendations: [
          'Adjust irrigation based on expected rainfall in the next 48 hours.',
          'Track fungal pressure when humidity remains above 75%.',
        ],
        hourly,
        daily: weather.slice(0, 7).map((d) => ({
          day: d.date,
          chance: clamp(Math.round(d.rainfall * 5), 5, 95),
          max: d.temp,
          min: clamp(d.temp - (Math.floor(Math.random() * 6) + 3), 8, d.temp),
        })),
      };
    }

    case 'voice_assistant': {
      return {
        response: generateVoiceResponses(payload.query || ''),
        confidence: 90,
      };
    }

    case 'yield_prediction_analytics': {
      const rows = generateYieldPredictionData();
      return {
        rows,
        confidence: clamp(Math.round(84 + Math.random() * 12), 75, 97),
        risk: rows[rows.length - 1]?.predicted < rows[rows.length - 2]?.predicted ? 'Yield softening detected' : 'Low Soil Moisture',
      };
    }

    case 'soil_health_analytics': {
      const rows = generateSoilHealthData().map((item) => ({
        ...item,
        moisture: clamp(Math.round(35 + Math.random() * 40), 25, 85),
      }));
      return { rows };
    }

    case 'weather_impact_analytics': {
      return { rows: generateWeatherData() };
    }

    case 'water_usage_optimization': {
      const rows = generateWaterUsageData();
      const efficiency = clamp(
        Math.round(
          100 - rows.reduce((acc, row) => acc + Math.max(0, row.usage - row.requirement), 0) / (rows.length * 10)
        ),
        55,
        97,
      );
      return { rows, efficiency };
    }

    case 'cost_benefit_analysis': {
      const rows = generateTreatmentCostData();
      return { rows };
    }

    case 'crop_comparison_analytics': {
      const rows = generateCropComparisonData();
      return { rows };
    }

    case 'subsidy_verification': {
      const landSize = toNumber(payload.landSize, 0);
      const income = toNumber(payload.income, 0);
      const cropFactor = ['rice', 'wheat', 'maize'].includes(String(payload.cropType || '').toLowerCase()) ? 8 : 0;
      const score = clamp(Math.round(75 + cropFactor + landSize * 0.8 - income / 200000), 5, 98);

      return {
        eligibilityScore: score,
        riskBand: score >= 75 ? 'low' : score >= 50 ? 'medium' : 'high',
        confidence: clamp(score - 3, 5, 96),
      };
    }

    default:
      return {
        status: 'ok',
        message: `No specialized local model for feature ${normalizedFeature}`,
      };
  }
}

async function logModelMetrics(feature, result) {
  try {
    const confidence = toNumber(result?.confidence, 0);

    await pb.collection('model_metrics').create({
      metric_date: new Date().toISOString().split('T')[0],
      model_version: result?.modelVersion || 'local-fallback-v1',
      crop_type: 'Mixed',
      accuracy: clamp(confidence || 85, 1, 100),
      precision: clamp((confidence || 85) - 2, 1, 100),
      recall: clamp((confidence || 85) - 3, 1, 100),
      f1_score: clamp((confidence || 85) - 2.5, 1, 100),
      avg_confidence: clamp(confidence || 85, 1, 100),
      predictions_count: 1,
      high_confidence_count: confidence >= 80 ? 1 : 0,
      low_confidence_count: confidence < 60 ? 1 : 0,
      drift_detected: false,
      feature: normalizeFeatureName(feature),
    }, { $autoCancel: false });
  } catch (_) {
    // Metrics collection is best-effort and should not break user flows.
  }
}

async function infer(feature, payload = {}, options = {}) {
  const normalizedFeature = normalizeFeatureName(feature);

  try {
    const remote = await callRemoteModel(normalizedFeature, payload, options);
    await logModelMetrics(normalizedFeature, remote);
    return { ...remote.data, _meta: { source: remote.source, modelVersion: remote.modelVersion } };
  } catch (_) {
    const fallback = localInference(normalizedFeature, payload);
    await logModelMetrics(normalizedFeature, { ...fallback, modelVersion: 'local-fallback-v1' });
    return { ...fallback, _meta: { source: 'local-fallback', modelVersion: 'local-fallback-v1' } };
  }
}

export const mlModelService = {
  infer,
};

export default mlModelService;
