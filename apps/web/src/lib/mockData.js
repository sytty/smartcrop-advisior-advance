export const generateFieldData = () => {
  return {
    n: Math.floor(Math.random() * (60 - 40 + 1)) + 40,
    p: Math.floor(Math.random() * (40 - 20 + 1)) + 20,
    k: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
    ph: (Math.random() * (7.5 - 6.0) + 6.0).toFixed(1),
    moisture: Math.floor(Math.random() * (80 - 30 + 1)) + 30,
    lastUpdated: new Date().toISOString()
  };
};

export const generateTrendData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    name: day,
    n: Math.floor(Math.random() * 20) + 40,
    p: Math.floor(Math.random() * 20) + 20,
    k: Math.floor(Math.random() * 20) + 30,
    moisture: Math.floor(Math.random() * 50) + 30
  }));
};

export const mockFarmers = [
  { id: 1, name: 'Rajesh Kumar', farm: 'Green Valley Farm', region: 'Maharashtra', status: 'Active', lastActivity: '2 mins ago' },
  { id: 2, name: 'Amit Singh', farm: 'Sunrise Acres', region: 'Punjab', status: 'Active', lastActivity: '1 hour ago' },
  { id: 3, name: 'Priya Patel', farm: 'Golden Harvest', region: 'Gujarat', status: 'Inactive', lastActivity: '2 days ago' },
  { id: 4, name: 'Suresh Reddy', farm: 'Deccan Fields', region: 'Andhra Pradesh', status: 'Active', lastActivity: '5 mins ago' },
  { id: 5, name: 'Vikram Sharma', farm: 'Northern Plains', region: 'Haryana', status: 'Warning', lastActivity: '10 mins ago' }
];

export const systemMetrics = {
  totalFarmers: 247,
  totalFields: 1203,
  activeAlerts: 12
};

const regionCoordinates = {
  'Maharashtra': [19.7515, 75.7139],
  'Punjab': [31.1471, 75.3412],
  'Karnataka': [15.3173, 75.7139],
  'Tamil Nadu': [11.1271, 78.6569],
  'Uttar Pradesh': [26.8467, 80.9462],
  'Rajasthan': [27.0238, 74.2179],
  'Gujarat': [22.2587, 71.1924],
  'Haryana': [29.0588, 76.0856],
  'Madhya Pradesh': [22.9734, 78.6569],
  'Andhra Pradesh': [15.9129, 79.7400]
};

const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Soybean', 'Maize'];

export const generateGeospatialFields = (count = 50) => {
  const fields = [];
  const regions = Object.keys(regionCoordinates);
  
  for (let i = 0; i < count; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const baseCoord = regionCoordinates[region];
    
    const lat = baseCoord[0] + (Math.random() - 0.5) * 2;
    const lng = baseCoord[1] + (Math.random() - 0.5) * 2;
    
    const healthScore = Math.floor(Math.random() * 100);
    let status = 'healthy';
    if (healthScore < 40) status = 'critical';
    else if (healthScore < 70) status = 'warning';

    fields.push({
      id: `field-${i}`,
      name: `Field ${Math.floor(Math.random() * 1000)}`,
      region,
      cropType: cropTypes[Math.floor(Math.random() * cropTypes.length)],
      lat,
      lng,
      healthScore,
      moisture: Math.floor(Math.random() * 60) + 20,
      temperature: Math.floor(Math.random() * 15) + 20,
      pestPressure: Math.floor(Math.random() * 100),
      status,
      lastUpdated: new Date().toISOString()
    });
  }
  return fields;
};

export const updateFieldHealthScores = (fields) => {
  return fields.map(field => {
    let newScore = field.healthScore + Math.floor(Math.random() * 11) - 5;
    newScore = Math.max(0, Math.min(100, newScore));
    
    let status = 'healthy';
    if (newScore < 40) status = 'critical';
    else if (newScore < 70) status = 'warning';

    return {
      ...field,
      healthScore: newScore,
      status,
      lastUpdated: new Date().toISOString()
    };
  });
};

export const generateRegionalStats = (fields = []) => {
  const totalFields = fields.length || 100;
  const avgHealth = fields.length ? Math.round(fields.reduce((acc, f) => acc + f.healthScore, 0) / totalFields) : 75;
  const alerts = fields.length ? fields.filter(f => f.status === 'critical' || f.status === 'warning').length : 15;
  
  const cropCounts = fields.reduce((acc, f) => {
    acc[f.cropType] = (acc[f.cropType] || 0) + 1;
    return acc;
  }, {});
  
  const mostCommonCrop = Object.keys(cropCounts).length ? Object.keys(cropCounts).reduce((a, b) => cropCounts[a] > cropCounts[b] ? a : b, '') : 'Wheat';

  return {
    totalFields,
    avgHealth,
    alerts,
    mostCommonCrop,
    totalArea: totalFields * 2.5,
    affectedFarmers: Math.floor(alerts * 0.8)
  };
};

export const generatePestRiskData = () => {
  const zones = [];
  const regions = Object.keys(regionCoordinates);
  const pestTypes = ['Fall Armyworm', 'Aphids', 'Locusts', 'Whitefly', 'Stem Borer'];
  
  regions.forEach((region, index) => {
    const baseCoord = regionCoordinates[region];
    const numZones = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < numZones; i++) {
      const riskLevel = Math.floor(Math.random() * 100);
      const lat = baseCoord[0] + (Math.random() - 0.5) * 1.5;
      const lng = baseCoord[1] + (Math.random() - 0.5) * 1.5;
      const radius = Math.floor(Math.random() * 30000) + 20000;
      
      const primaryPest = pestTypes[Math.floor(Math.random() * pestTypes.length)];
      
      const progression = [];
      let currentRisk = Math.max(10, riskLevel - 30);
      for (let d = 6; d >= 0; d--) {
        progression.push({
          day: `Day -${d}`,
          risk: currentRisk
        });
        currentRisk = Math.min(100, currentRisk + Math.floor(Math.random() * 15) - 2);
      }

      zones.push({
        id: `zone-${region}-${i}`,
        region,
        lat,
        lng,
        radius,
        riskLevel,
        primaryPest,
        affectedArea: Math.floor(Math.random() * 5000) + 1000,
        recommendedPesticide: `${primaryPest.split(' ')[0]}Guard Pro`,
        progression
      });
    }
  });
  
  return zones;
};

export const generateVoiceResponses = (query) => {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('plant today')) return "Based on current soil moisture (45%) and upcoming weather, it's an excellent day to plant soybeans. Ensure you plant at a depth of 1.5 inches.";
  if (lowerQuery.includes('soil ready')) return "Your soil pH is currently 6.5 with optimal nitrogen levels. Yes, it is perfectly balanced for your upcoming wheat cycle.";
  if (lowerQuery.includes('pest risk')) return "There is a moderate risk (45%) of Aphids in your region over the next 3 days. I recommend a preventative neem oil spray.";
  if (lowerQuery.includes('fertilizer')) return "Your phosphorus levels are slightly low. Apply 20kg of DAP per hectare to reach optimal levels for the current growth stage.";
  if (lowerQuery.includes('harvest')) return "Based on the accumulated growing degree days, your crop should be ready for harvest in approximately 12 to 14 days.";
  if (lowerQuery.includes('subsidy')) return "You are eligible for the PM-KISAN scheme and a 30% subsidy on drip irrigation equipment. Would you like me to open the application portal?";
  return "I'm analyzing your field data. Everything looks stable, but please check the dashboard for detailed NPK and moisture metrics.";
};

export const getFieldById = (id) => {
  const fields = generateGeospatialFields(10);
  return fields.find(f => f.id === id) || fields[0];
};

export const generateDiseaseHotspots = () => {
  return Array.from({ length: 5 }).map((_, i) => {
    const regions = Object.keys(regionCoordinates);
    const region = regions[Math.floor(Math.random() * regions.length)];
    const baseCoord = regionCoordinates[region];
    
    return {
      id: `disease-${i}`,
      type: 'disease',
      name: ['Leaf Blight', 'Rust', 'Powdery Mildew', 'Anthracnose'][Math.floor(Math.random() * 4)],
      severity: ['mild', 'moderate', 'severe'][Math.floor(Math.random() * 3)],
      action: 'Apply fungicide immediately',
      lat: baseCoord[0] + (Math.random() - 0.5) * 2,
      lng: baseCoord[1] + (Math.random() - 0.5) * 2,
      radius: Math.floor(Math.random() * 15000) + 5000,
      affectedFields: Math.floor(Math.random() * 50) + 10
    };
  });
};

export const generateMoistureZones = () => {
  return Array.from({ length: 2 }).map((_, i) => ({
    id: `moisture-${i}`,
    type: 'moisture',
    name: 'Low Moisture Zone',
    severity: ['moderate', 'severe'][Math.floor(Math.random() * 2)],
    action: 'Increase irrigation by 20%',
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10
  }));
};

export const generateNutrientDeficiencies = () => {
  return Array.from({ length: 2 }).map((_, i) => ({
    id: `nutrient-${i}`,
    type: 'nutrient',
    name: ['Nitrogen Deficiency', 'Potassium Deficiency'][Math.floor(Math.random() * 2)],
    severity: ['mild', 'moderate'][Math.floor(Math.random() * 2)],
    action: 'Apply targeted NPK blend',
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10
  }));
};

export const generateDiseaseDetectionData = () => {
  const diseases = [
    { name: 'Late Blight', part: 'leaf' },
    { name: 'Powdery Mildew', part: 'leaf' },
    { name: 'Root Rot', part: 'root' },
    { name: 'Stem Rust', part: 'stem' },
    { name: 'Anthracnose', part: 'fruit' }
  ];
  const selected = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = Math.floor(Math.random() * 25) + 70;
  
  let severity = 'mild';
  if (confidence > 85) severity = 'severe';
  else if (confidence > 78) severity = 'moderate';

  return {
    name: selected.name,
    confidence,
    severity,
    affectedPart: selected.part,
    description: `A common fungal disease affecting the ${selected.part} of the plant, characterized by rapid spread under humid conditions.`,
    symptoms: [
      'Dark, water-soaked lesions',
      'White fungal growth on undersides',
      'Rapid yellowing and wilting'
    ],
    treatments: {
      organic: {
        name: 'Neem Oil Extract & Copper Soap',
        schedule: 'Apply every 7 days',
        cost: '$15/acre',
        method: 'Foliar spray',
        recoveryTime: '10-14 days'
      },
      chemical: {
        name: 'Chlorothalonil Fungicide',
        schedule: 'Apply every 14 days',
        cost: '$35/acre',
        method: 'High-pressure spray',
        recoveryTime: '5-7 days'
      }
    },
    preventionTips: [
      'Ensure proper plant spacing for air circulation',
      'Avoid overhead watering to keep foliage dry',
      'Remove and destroy infected plant debris'
    ],
    similarDiseases: confidence < 85 ? ['Early Blight', 'Septoria Leaf Spot'] : []
  };
};

export const generateRegionalOutbreakData = () => {
  const regions = Object.keys(regionCoordinates).slice(0, 5);
  return regions.map((region, i) => ({
    id: `outbreak-${i}`,
    region,
    severity: ['mild', 'moderate', 'severe'][Math.floor(Math.random() * 3)],
    affectedCrops: [cropTypes[Math.floor(Math.random() * cropTypes.length)], cropTypes[Math.floor(Math.random() * cropTypes.length)]],
    fieldCount: Math.floor(Math.random() * 150) + 20,
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
  }));
};

export const generatePestRiskByRegion = () => {
  const regions = Object.keys(regionCoordinates);
  const pests = ['Fall Armyworm', 'Aphids', 'Locusts', 'Whitefly', 'Stem Borer'];
  
  return regions.map((region, i) => {
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    return {
      id: `risk-${i}`,
      region,
      riskLevel: risk,
      commonPest: pests[Math.floor(Math.random() * pests.length)],
      recommendedAction: risk === 'critical' ? 'Immediate chemical intervention' : 'Monitor and apply organic deterrents',
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
    };
  });
};

export const generateAlertTimeline = () => {
  const types = ['disease', 'pest', 'weather', 'soil'];
  const statuses = ['active', 'resolved'];
  
  return Array.from({ length: 8 }).map((_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: `alert-${i}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Alert in Sector ${Math.floor(Math.random() * 9) + 1}`,
      affectedFieldsCount: Math.floor(Math.random() * 50) + 5,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: new Date(Date.now() - (i * 3600000) - Math.random() * 1000000).toISOString(),
      details: `Detected abnormal ${type} patterns affecting multiple adjacent fields. Immediate scouting recommended.`
    };
  });
};

export const getDiseasesForCrop = (cropType) => {
  const db = {
    'Wheat': [
      { name: 'Wheat Rust', description: 'Fungal disease causing orange/brown pustules.', symptoms: 'Pustules on leaves and stems.' },
      { name: 'Powdery Mildew', description: 'White powdery fungal growth.', symptoms: 'White patches on upper leaf surfaces.' }
    ],
    'Rice': [
      { name: 'Rice Blast', description: 'Fungal disease affecting all above-ground parts.', symptoms: 'Diamond-shaped lesions on leaves.' },
      { name: 'Bacterial Blight', description: 'Bacterial infection causing wilting.', symptoms: 'Water-soaked stripes on leaf blades.' }
    ]
  };
  
  return db[cropType] || [
    { name: 'General Blight', description: 'Common fungal infection.', symptoms: 'Dark spots on leaves.' },
    { name: 'Root Rot', description: 'Soil-borne fungal disease.', symptoms: 'Yellowing leaves, stunted growth.' }
  ];
};

export const generateModelMetricsHistory = () => {
  const history = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const isDriftEvent = i > 8 && i < 12;
    
    const baseAccuracy = isDriftEvent ? 86 : 92;
    const accuracy = baseAccuracy + (Math.random() * 4 - 2);
    const precision = accuracy - (Math.random() * 3);
    const recall = accuracy - (Math.random() * 4);
    const f1_score = 2 * ((precision * recall) / (precision + recall));
    
    const predictions_count = Math.floor(Math.random() * 400) + 100;
    const high_confidence_count = Math.floor(predictions_count * (isDriftEvent ? 0.6 : 0.85));
    const low_confidence_count = Math.floor(predictions_count * (isDriftEvent ? 0.2 : 0.05));
    const avg_confidence = isDriftEvent ? 82 : 91 + (Math.random() * 4 - 2);
    
    history.push({
      metric_date: date.toISOString().split('T')[0],
      accuracy: parseFloat(accuracy.toFixed(2)),
      precision: parseFloat(precision.toFixed(2)),
      recall: parseFloat(recall.toFixed(2)),
      f1_score: parseFloat(f1_score.toFixed(2)),
      predictions_count,
      high_confidence_count,
      low_confidence_count,
      avg_confidence: parseFloat(avg_confidence.toFixed(2)),
      crop_type: cropTypes[Math.floor(Math.random() * cropTypes.length)],
      model_version: i > 15 ? 'v1.1' : 'v2.0',
      drift_detected: isDriftEvent
    });
  }
  
  return history;
};

export const generateSubsidyEligibility = () => {
  return [
    { id: 'se1', crop_type: 'Wheat', min_land_size: 0.5, max_land_size: 10, subsidy_rate: 25, max_subsidy_amount: 50000, income_threshold: 500000 },
    { id: 'se2', crop_type: 'Rice', min_land_size: 0.5, max_land_size: 10, subsidy_rate: 30, max_subsidy_amount: 60000, income_threshold: 500000 },
    { id: 'se3', crop_type: 'Cotton', min_land_size: 1, max_land_size: 20, subsidy_rate: 20, max_subsidy_amount: 80000, income_threshold: 600000 },
    { id: 'se4', crop_type: 'Sugarcane', min_land_size: 0.5, max_land_size: 15, subsidy_rate: 35, max_subsidy_amount: 105000, income_threshold: 600000 },
    { id: 'se5', crop_type: 'Maize', min_land_size: 0.5, max_land_size: 10, subsidy_rate: 22.5, max_subsidy_amount: 45000, income_threshold: 500000 }
  ];
};

export const generateSubsidyApplications = (farmerCount = 10) => {
  const statuses = ['submitted', 'under_review', 'approved', 'rejected', 'paid'];
  const apps = [];
  for (let i = 0; i < farmerCount; i++) {
    const crop = cropTypes[Math.floor(Math.random() * cropTypes.length)];
    const landSize = (Math.random() * 10 + 1).toFixed(1);
    apps.push({
      id: `app-${i}`,
      farmer_id: `farmer-${i}`,
      expand: { farmer_id: { name: `Farmer ${i}`, email: `farmer${i}@example.com` } },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      land_size: parseFloat(landSize),
      crop_type: crop,
      yield_data: Math.floor(Math.random() * 5000) + 1000,
      bank_account: `XXXX-XXXX-${Math.floor(Math.random() * 9000) + 1000}`,
      subsidy_amount: Math.floor(Math.random() * 40000) + 10000,
      eligibility_verified: Math.random() > 0.2,
      application_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      admin_notes: Math.random() > 0.5 ? 'Documents verified.' : ''
    });
  }
  return apps;
};

export const generateSubsidyDocuments = (applicationCount = 10) => {
  const docs = [];
  const types = ['land_certificate', 'id_proof', 'bank_statement'];
  for (let i = 0; i < applicationCount; i++) {
    types.forEach(type => {
      docs.push({
        id: `doc-${i}-${type}`,
        application_id: `app-${i}`,
        document_type: type,
        file: `${type}_sample.pdf`,
        uploaded_at: new Date().toISOString()
      });
    });
  }
  return docs;
};

export const generateSyncQueueData = (farmerId, count = 15) => {
  const statuses = ['pending', 'syncing', 'synced', 'failed'];
  const actionTypes = ['diagnosis', 'treatment', 'yield', 'subsidy', 'prediction'];
  const items = [];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isFailed = status === 'failed';
    
    items.push({
      id: `sync-${i}`,
      user_id: farmerId,
      action_type: actionTypes[Math.floor(Math.random() * actionTypes.length)],
      data: { sample: 'data' },
      status,
      created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      error_message: isFailed ? 'Network timeout during upload' : '',
      retry_count: isFailed ? Math.floor(Math.random() * 3) + 1 : 0,
      synced_at: status === 'synced' ? new Date().toISOString() : null
    });
  }
  return items;
};

export const generateOfflineCacheData = (farmerId) => {
  return [
    {
      id: 'cache-1',
      user_id: farmerId,
      cache_type: 'field_data',
      data: { fields: generateGeospatialFields(5) },
      last_updated: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 7).toISOString()
    },
    {
      id: 'cache-2',
      user_id: farmerId,
      cache_type: 'diagnoses',
      data: { recent: [generateDiseaseDetectionData()] },
      last_updated: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 30).toISOString()
    },
    {
      id: 'cache-3',
      user_id: farmerId,
      cache_type: 'treatments',
      data: { history: [] },
      last_updated: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 30).toISOString()
    }
  ];
};

export const generateSyncHistoryData = (count = 10) => {
  const history = [];
  for (let i = 0; i < count; i++) {
    const totalItems = Math.floor(Math.random() * 20) + 1;
    const failedItems = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
    
    history.push({
      id: `hist-${i}`,
      timestamp: new Date(Date.now() - (i * 3600000 * 4)).toISOString(),
      duration_ms: Math.floor(Math.random() * 5000) + 500,
      items_synced: totalItems - failedItems,
      failed_count: failedItems
    });
  }
  return history;
};

export const generateConflictData = () => {
  return [
    {
      id: 'conflict-1',
      entity_type: 'field_data',
      entity_id: 'field-123',
      local_data: { moisture: 45, last_updated: new Date().toISOString() },
      server_data: { moisture: 42, last_updated: new Date(Date.now() - 3600000).toISOString() },
      conflict_reason: 'Concurrent modification detected'
    },
    {
      id: 'conflict-2',
      entity_type: 'treatment',
      entity_id: 'treat-456',
      local_data: { status: 'completed', notes: 'Applied 20kg' },
      server_data: { status: 'pending', notes: '' },
      conflict_reason: 'Server version is older but locked'
    }
  ];
};

export const generateAROverlayData = () => {
  return {
    markers: [
      { id: 'm1', x: 25, y: 30, type: 'disease', label: 'Leaf Blight Detected', severity: 'high' },
      { id: 'm2', x: 60, y: 45, type: 'moisture', label: 'Low Moisture Zone', severity: 'medium' },
      { id: 'm3', x: 80, y: 70, type: 'pest', label: 'Aphid Activity', severity: 'low' }
    ],
    metrics: {
      healthScore: 82,
      avgMoisture: 45,
      temperature: 24,
      nitrogen: 42
    }
  };
};

// Phase 3 Analytics Generators
export const generateYieldPredictionData = () => {
  const data = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    data.push({
      month: d.toLocaleString('default', { month: 'short' }),
      predicted: Math.floor(Math.random() * 2000) + 3000,
      actual: Math.floor(Math.random() * 2000) + 2800
    });
  }
  return data;
};

export const generateSoilHealthData = () => {
  const data = [];
  const today = new Date();
  for (let i = 30; i >= 0; i -= 5) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
      ph: (Math.random() * 1.5 + 6.0).toFixed(1),
      nitrogen: Math.floor(Math.random() * 40) + 40,
      phosphorus: Math.floor(Math.random() * 30) + 30,
      potassium: Math.floor(Math.random() * 50) + 50,
      score: Math.floor(Math.random() * 20) + 70
    });
  }
  return data;
};

export const generateWeatherData = () => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    data.push({
      date: d.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
      temp: Math.floor(Math.random() * 15) + 20,
      rainfall: Math.floor(Math.random() * 20),
      humidity: Math.floor(Math.random() * 40) + 40,
      wind: Math.floor(Math.random() * 15) + 5
    });
  }
  return data;
};

export const generateTreatmentCostData = () => {
  return [
    { name: 'Pesticide', cost: Math.floor(Math.random() * 500) + 200, benefit: Math.floor(Math.random() * 1000) + 800 },
    { name: 'Fungicide', cost: Math.floor(Math.random() * 400) + 150, benefit: Math.floor(Math.random() * 800) + 600 },
    { name: 'Fertilizer', cost: Math.floor(Math.random() * 800) + 400, benefit: Math.floor(Math.random() * 1500) + 1200 },
    { name: 'Labor', cost: Math.floor(Math.random() * 1000) + 500, benefit: Math.floor(Math.random() * 2000) + 1500 },
    { name: 'Equipment', cost: Math.floor(Math.random() * 600) + 300, benefit: Math.floor(Math.random() * 1200) + 900 }
  ];
};

export const generateFarmerPerformanceData = () => {
  return [
    { subject: 'Yield', A: Math.floor(Math.random() * 30) + 70, B: 80, fullMark: 100 },
    { subject: 'Soil Health', A: Math.floor(Math.random() * 30) + 70, B: 75, fullMark: 100 },
    { subject: 'Disease Control', A: Math.floor(Math.random() * 30) + 70, B: 85, fullMark: 100 },
    { subject: 'Pest Control', A: Math.floor(Math.random() * 30) + 70, B: 82, fullMark: 100 },
    { subject: 'Water Efficiency', A: Math.floor(Math.random() * 30) + 70, B: 78, fullMark: 100 },
    { subject: 'Cost Efficiency', A: Math.floor(Math.random() * 30) + 70, B: 88, fullMark: 100 }
  ];
};

export const generateCropComparisonData = () => {
  return cropTypes.map(crop => ({
    name: crop,
    yield: Math.floor(Math.random() * 5000) + 2000,
    profitability: Math.floor(Math.random() * 80) + 20,
    waterUsage: Math.floor(Math.random() * 100) + 50
  }));
};

export const generateMarketPriceData = () => {
  const data = [];
  const today = new Date();
  for (let i = 30; i >= 0; i -= 3) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
      Wheat: Math.floor(Math.random() * 500) + 2000,
      Rice: Math.floor(Math.random() * 600) + 2500,
      Cotton: Math.floor(Math.random() * 1000) + 4000
    });
  }
  return data;
};

export const generateWaterUsageData = () => {
  const data = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    data.push({
      month: d.toLocaleString('default', { month: 'short' }),
      usage: Math.floor(Math.random() * 500) + 1000,
      requirement: Math.floor(Math.random() * 400) + 1100
    });
  }
  return data;
};