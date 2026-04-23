import apiConfig from '../config/env.js';

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function predictCropAdvisor(payload = {}) {
  const nitrogen = toNumber(payload.nitrogen, 55);
  const phosphorus = toNumber(payload.phosphorus, 35);
  const potassium = toNumber(payload.potassium, 45);
  const ph = toNumber(payload.ph, 6.5);
  const crop = payload.targetCrop || 'Wheat';

  const nutrientBalance = (nitrogen + phosphorus + potassium) / 3;
  const confidence = clamp(Math.round(72 + (nutrientBalance / 100) * 22 - Math.abs(ph - 6.7) * 8), 58, 98);

  return {
    crop,
    confidence,
    fertilizer: `Apply ${Math.max(20, Math.round((90 - nutrientBalance) * 0.75))}kg/ha split nutrient blend in 2 stages.`,
    water: `Maintain soil moisture near ${clamp(Math.round(58 + (7 - ph) * 6), 45, 72)}% and irrigate every ${clamp(Math.round(6 + (ph - 6.5) * 2), 4, 9)} days.`,
    risk: confidence > 85 ? 'Low disease pressure expected with current balance.' : 'Moderate stress risk detected; monitor humidity and leaf lesions weekly.',
    yield: `${(3.1 + confidence / 48).toFixed(1)} tons/ha expected`,
  };
}

function predictDisease() {
  const diseases = [
    { name: 'Leaf Rust', severity: 'Moderate' },
    { name: 'Powdery Mildew', severity: 'Low' },
    { name: 'Stem Rust', severity: 'High' },
    { name: 'Leaf Blight', severity: 'Moderate' },
  ];

  const selected = pickRandom(diseases);
  const confidence = Math.floor(Math.random() * 16) + 82;

  return {
    disease: selected.name,
    confidence,
    severity: selected.severity,
    treatment: 'Apply targeted fungicide and repeat in 7-10 days based on field scout report.',
    prevention: 'Improve canopy airflow, avoid overhead irrigation at dusk, and remove infected debris.',
  };
}

function predictPest() {
  const pests = ['Fall Armyworm', 'Aphids', 'Whitefly', 'Stem Borer'];
  const pest = pickRandom(pests);
  const confidence = Math.floor(Math.random() * 15) + 83;
  const severity = confidence > 93 ? 'High' : confidence > 88 ? 'Moderate' : 'Low';

  return {
    pest,
    confidence,
    severity,
    damage: `${Math.floor((100 - confidence) * 0.9 + 8)}%`,
    treatment: 'Apply targeted bio-compatible pesticide within 24 hours and re-check after 72 hours.',
    biological: 'Release beneficial predators and deploy pheromone traps around hot zones.',
  };
}

function weatherRows(days = 14) {
  const rows = [];
  const today = new Date();

  for (let i = 0; i < days; i += 1) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);

    rows.push({
      date: d.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
      temp: Math.floor(Math.random() * 15) + 20,
      rainfall: Math.floor(Math.random() * 20),
      humidity: Math.floor(Math.random() * 40) + 40,
      wind: Math.floor(Math.random() * 15) + 5,
    });
  }

  return rows;
}

function predictWeather() {
  const dailyRows = weatherRows(14);
  const hourly = Array.from({ length: 12 }).map((_, i) => ({
    label: `${(i % 12) + 1}:00 ${i < 6 ? 'PM' : 'AM'}`,
    rain: Math.random() > 0.55,
    temp: clamp(29 - i + Math.floor(Math.random() * 2), 14, 40),
  }));

  const severeRain = dailyRows.some((item) => item.rainfall > 14);

  return {
    weatherScore: clamp(Math.round(72 + Math.random() * 24), 60, 96),
    current: {
      temperature: dailyRows[0]?.temp ?? 24,
      condition: (dailyRows[0]?.rainfall ?? 0) > 6 ? 'Light Rain' : 'Partly Cloudy',
      humidity: dailyRows[0]?.humidity ?? 52,
      wind: dailyRows[0]?.wind ?? 9,
      uv: (dailyRows[0]?.temp ?? 0) > 30 ? 'High' : 'Moderate',
    },
    alerts: severeRain
      ? ['Heavy rainfall expected. Delay fertilizer application for 24-36 hours.']
      : [],
    recommendations: [
      'Adjust irrigation using 48-hour rain probability to avoid overwatering.',
      'Track fungal pressure when humidity remains above 75% for >8 hours.',
    ],
    hourly,
    daily: dailyRows.slice(0, 7).map((item) => ({
      day: item.date,
      chance: clamp(Math.round(item.rainfall * 5), 5, 95),
      max: item.temp,
      min: clamp(item.temp - (Math.floor(Math.random() * 6) + 3), 8, item.temp),
    })),
  };
}

function yieldRows() {
  const rows = [];
  const today = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    rows.push({
      month: d.toLocaleString('default', { month: 'short' }),
      predicted: Math.floor(Math.random() * 2000) + 3000,
      actual: Math.floor(Math.random() * 2000) + 2800,
    });
  }

  return rows;
}

function soilRows() {
  const rows = [];
  const today = new Date();

  for (let i = 30; i >= 0; i -= 5) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    rows.push({
      date: d.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
      ph: Number((Math.random() * 1.5 + 6.0).toFixed(1)),
      nitrogen: Math.floor(Math.random() * 40) + 40,
      phosphorus: Math.floor(Math.random() * 30) + 30,
      potassium: Math.floor(Math.random() * 50) + 50,
      moisture: clamp(Math.round(35 + Math.random() * 40), 25, 85),
      score: Math.floor(Math.random() * 20) + 70,
    });
  }

  return rows;
}

function waterRows() {
  const rows = [];
  const today = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    rows.push({
      month: d.toLocaleString('default', { month: 'short' }),
      usage: Math.floor(Math.random() * 500) + 1000,
      requirement: Math.floor(Math.random() * 400) + 1100,
    });
  }

  return rows;
}

function costRows() {
  return [
    { name: 'Pesticide', cost: Math.floor(Math.random() * 500) + 200, benefit: Math.floor(Math.random() * 1000) + 800 },
    { name: 'Fungicide', cost: Math.floor(Math.random() * 400) + 150, benefit: Math.floor(Math.random() * 800) + 600 },
    { name: 'Fertilizer', cost: Math.floor(Math.random() * 800) + 400, benefit: Math.floor(Math.random() * 1500) + 1200 },
    { name: 'Labor', cost: Math.floor(Math.random() * 1000) + 500, benefit: Math.floor(Math.random() * 2000) + 1500 },
    { name: 'Equipment', cost: Math.floor(Math.random() * 600) + 300, benefit: Math.floor(Math.random() * 1200) + 900 },
  ];
}

function cropComparisonRows() {
  const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Soybean', 'Maize'];
  return cropTypes.map((crop) => ({
    name: crop,
    yield: Math.floor(Math.random() * 5000) + 2000,
    profitability: Math.floor(Math.random() * 80) + 20,
    waterUsage: Math.floor(Math.random() * 100) + 50,
  }));
}

function predictSubsidy(payload = {}) {
  const landSize = toNumber(payload.landSize, 0);
  const income = toNumber(payload.income, 0);
  const cropType = String(payload.cropType || '').toLowerCase();
  const cropFactor = ['rice', 'wheat', 'maize'].includes(cropType) ? 8 : 0;
  const eligibilityScore = clamp(Math.round(75 + cropFactor + landSize * 0.8 - income / 200000), 5, 98);

  return {
    eligibilityScore,
    riskBand: eligibilityScore >= 75 ? 'low' : eligibilityScore >= 50 ? 'medium' : 'high',
    confidence: clamp(eligibilityScore - 3, 5, 96),
  };
}

function predictVoice(payload = {}) {
  const query = String(payload.query || '').toLowerCase();

  if (query.includes('plant today')) {
    return { response: 'Based on moisture and weather trend, planting soybeans today is favorable. Keep seed depth near 1.5 inches.', confidence: 90 };
  }
  if (query.includes('soil ready')) {
    return { response: 'Your soil pH and nutrient balance are in an optimal band for the next planting cycle.', confidence: 91 };
  }
  if (query.includes('pest risk')) {
    return { response: 'Pest pressure is moderate in your zone. Start preventive scouting and deploy traps today.', confidence: 89 };
  }

  return { response: 'Field indicators are stable right now. Review dashboard alerts for nutrient and moisture recommendations.', confidence: 88 };
}

async function callExternalProvider(feature, payload) {
  if (!apiConfig.ml.enabled || !apiConfig.ml.providerUrl) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.ml.timeoutMs);

  try {
    const response = await fetch(apiConfig.ml.providerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiConfig.ml.providerApiKey ? { Authorization: `Bearer ${apiConfig.ml.providerApiKey}` } : {}),
      },
      body: JSON.stringify({ feature, payload }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`External ML provider returned ${response.status}`);
    }

    const body = await response.json();
    if (!body || typeof body !== 'object') {
      throw new Error('External ML provider response was invalid');
    }

    const data = body.data ?? body.result ?? body;
    return {
      ...data,
      _meta: {
        source: 'external-provider',
        modelVersion: body.modelVersion || body.model_version || 'external-v1',
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function runInference(feature, payload = {}) {
  switch (String(feature || '').toLowerCase()) {
    case 'ai_crop_advisor':
      return predictCropAdvisor(payload);
    case 'crop_disease_detector':
      return predictDisease();
    case 'ai_pest_management':
      return predictPest();
    case 'predictive_weather':
      return predictWeather();
    case 'voice_assistant':
      return predictVoice(payload);
    case 'yield_prediction_analytics': {
      const rows = yieldRows();
      return {
        rows,
        confidence: clamp(Math.round(84 + Math.random() * 12), 75, 97),
        risk: rows[rows.length - 1]?.predicted < rows[rows.length - 2]?.predicted ? 'Yield softening detected' : 'Low Soil Moisture',
      };
    }
    case 'soil_health_analytics':
      return { rows: soilRows() };
    case 'weather_impact_analytics':
      return { rows: weatherRows(14) };
    case 'water_usage_optimization': {
      const rows = waterRows();
      const efficiency = clamp(
        Math.round(100 - rows.reduce((acc, row) => acc + Math.max(0, row.usage - row.requirement), 0) / (rows.length * 10)),
        55,
        97,
      );
      return { rows, efficiency };
    }
    case 'cost_benefit_analysis':
      return { rows: costRows() };
    case 'crop_comparison_analytics':
      return { rows: cropComparisonRows() };
    case 'subsidy_verification':
      return predictSubsidy(payload);
    default:
      return {
        status: 'ok',
        message: `No specialized inference configured for feature ${feature}`,
      };
  }
}

async function infer(feature, payload = {}) {
  const externalResult = await callExternalProvider(feature, payload).catch(() => null);
  if (externalResult) {
    return externalResult;
  }

  const fallbackResult = runInference(feature, payload);
  return {
    ...fallbackResult,
    _meta: {
      source: 'local-fallback',
      modelVersion: 'horizons-ml-local-v1',
    },
  };
}

export { infer, runInference };
