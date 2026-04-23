import { Router } from 'express';
import apiConfig from '../config/env.js';
import pocketbaseClient from '../utils/pocketbaseClient.js';
import { checkPocketBaseHealth, getPocketBaseRuntimeState } from '../utils/pocketbaseClient.js';

function getFarmerId(req) {
  return String(req.query.farmerId || req.body?.farmerId || req.body?.farmer_id || '').trim();
}

function isAdminScope(req) {
  return String(req.query.scope || req.body?.scope || '').toLowerCase() === 'all';
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getBearerToken(req) {
  const authHeader = String(req.headers.authorization || '').trim();
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return '';
  }

  return authHeader.slice(7).trim();
}

async function resolveRequestIdentity(req) {
  const token = getBearerToken(req);
  if (!token) {
    throw createHttpError(401, 'Authorization token is required');
  }

  const response = await fetch(`${apiConfig.pocketbase.baseUrl}/api/collections/users/auth-refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw createHttpError(401, 'Invalid or expired authentication token');
  }

  const payload = await response.json();
  const identity = payload?.record;
  if (!identity?.id) {
    throw createHttpError(401, 'Unable to resolve user identity from token');
  }

  return {
    id: String(identity.id),
    role: String(identity.role || 'farmer').toLowerCase(),
    email: identity.email || '',
  };
}

function isAdmin(identity) {
  return identity?.role === 'admin';
}

function ensureAdmin(identity) {
  if (!isAdmin(identity)) {
    throw createHttpError(403, 'Admin access required');
  }
}

function getEffectiveFarmerId(req, identity) {
  if (isAdmin(identity)) {
    return getFarmerId(req) || identity.id;
  }

  return identity.id;
}

function ensureRecordAccess(record, identity, recordLabel) {
  if (isAdmin(identity)) {
    return;
  }

  const ownerId = String(record?.farmer_id || '').trim();
  if (!ownerId || ownerId !== identity.id) {
    throw createHttpError(403, `You do not have access to this ${recordLabel}`);
  }
}

function ensureId(value) {
  const id = String(value || '').trim();
  if (!id) {
    throw new Error('A record id is required');
  }

  return id;
}

function pickNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeText(value) {
  const text = String(value || '').trim();
  return text || null;
}

function getBenchmark(value, min, max) {
  if (value === null || value === undefined) return Math.round((min + max) / 2);
  return Math.max(min, Math.min(max, value));
}

function average(items, selector) {
  const values = items.map(selector).filter((value) => Number.isFinite(value));
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function listRecords(collection, options = {}) {
  const response = await pocketbaseClient.collection(collection).getList(options.page || 1, options.perPage || 100, {
    sort: options.sort || '-updated',
    ...(options.filter ? { filter: options.filter } : {}),
    $autoCancel: false,
  });

  return response.items;
}

async function countRecords(collection, filter = '') {
  const response = await pocketbaseClient.collection(collection).getList(1, 1, {
    ...(filter ? { filter } : {}),
    $autoCancel: false,
  });

  return Number(response?.totalItems || 0);
}

async function safeCollectionCall(action, fallback) {
  try {
    return await action();
  } catch {
    // Some collections are optional depending on migration state.
    return fallback;
  }
}

function toIsoDateOrNull(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function summarizeUsers(users) {
  return users.map((user) => ({
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    role: (user.role || 'farmer').toLowerCase(),
    farm_name: user.farm_name || '',
    region: user.region || '',
    created: toIsoDateOrNull(user.created),
    updated: toIsoDateOrNull(user.updated),
    verified: Boolean(user.verified),
  }));
}

function buildFieldPayload(body, farmerId, fallback = {}) {
  return {
    farmer_id: farmerId,
    field_name: normalizeText(body.field_name ?? fallback.field_name),
    location: normalizeText(body.location ?? fallback.location),
    area_size: pickNumber(body.area_size ?? fallback.area_size),
    crop_type: normalizeText(body.crop_type ?? fallback.crop_type),
    soil_type: normalizeText(body.soil_type ?? fallback.soil_type),
    current_health_score: pickNumber(body.current_health_score ?? fallback.current_health_score),
    last_monitored: normalizeText(body.last_monitored ?? fallback.last_monitored),
  };
}

function buildCropPayload(body, farmerId, fallback = {}) {
  return {
    farmer_id: farmerId,
    crop_type: normalizeText(body.crop_type ?? fallback.crop_type),
    yield: pickNumber(body.yield ?? fallback.yield),
    profitability: pickNumber(body.profitability ?? fallback.profitability),
    water_usage: pickNumber(body.water_usage ?? fallback.water_usage),
    disease_risk: pickNumber(body.disease_risk ?? fallback.disease_risk),
    pest_risk: pickNumber(body.pest_risk ?? fallback.pest_risk),
    soil_requirements: Array.isArray(body.soil_requirements ?? fallback.soil_requirements)
      ? body.soil_requirements ?? fallback.soil_requirements
      : String((body.soil_requirements ?? fallback.soil_requirements) || '').split('\n').map((item) => item.trim()).filter(Boolean),
  };
}

function calculatePerformance(fields, crops) {
  const fieldHealth = average(fields, (field) => Number(field.current_health_score));
  const averageYield = average(crops, (crop) => Number(crop.yield));
  const averageProfitability = average(crops, (crop) => Number(crop.profitability));
  const averageWaterUsage = average(crops, (crop) => Number(crop.water_usage));
  const averageDiseaseRisk = average(crops, (crop) => Number(crop.disease_risk));
  const averagePestRisk = average(crops, (crop) => Number(crop.pest_risk));
  const cropDiversity = new Set([...fields.map((item) => item.crop_type), ...crops.map((item) => item.crop_type)].filter(Boolean)).size;

  const overallScore = Math.round(
    (
      getBenchmark(fieldHealth, 0, 100) * 0.25 +
      getBenchmark(averageProfitability, 0, 100) * 0.25 +
      (100 - getBenchmark(averageDiseaseRisk, 0, 100)) * 0.15 +
      (100 - getBenchmark(averagePestRisk, 0, 100)) * 0.15 +
      Math.max(0, 100 - getBenchmark(averageWaterUsage / 20, 0, 100)) * 0.1 +
      Math.min(100, (averageYield / 100) || 0) * 0.1
    )
  );

  const radar = [
    { subject: 'Yield', A: Math.round(getBenchmark(averageYield / 60, 0, 100)), B: 80, fullMark: 100 },
    { subject: 'Soil Health', A: Math.round(getBenchmark(fieldHealth, 0, 100)), B: 75, fullMark: 100 },
    { subject: 'Disease Control', A: Math.round(100 - getBenchmark(averageDiseaseRisk, 0, 100)), B: 85, fullMark: 100 },
    { subject: 'Pest Control', A: Math.round(100 - getBenchmark(averagePestRisk, 0, 100)), B: 82, fullMark: 100 },
    { subject: 'Water Efficiency', A: Math.round(Math.max(0, 100 - getBenchmark(averageWaterUsage / 20, 0, 100))), B: 78, fullMark: 100 },
    { subject: 'Cost Efficiency', A: Math.round(getBenchmark(averageProfitability, 0, 100)), B: 88, fullMark: 100 },
  ];

  const strongest = radar.slice().sort((left, right) => right.A - left.A)[0]?.subject || 'Yield';

  return {
    score: overallScore,
    rank: `Top ${Math.max(5, Math.min(40, 100 - overallScore))}%`,
    strongest,
    radar,
    metrics: {
      fields: fields.length,
      crops: crops.length,
      cropDiversity,
      averageFieldHealth: Math.round(fieldHealth),
      averageYield: Math.round(averageYield),
      averageProfitability: Math.round(averageProfitability),
      averageWaterUsage: Math.round(averageWaterUsage),
      averageDiseaseRisk: Math.round(averageDiseaseRisk),
      averagePestRisk: Math.round(averagePestRisk),
      recentFieldUpdates: fields.filter((field) => {
        const lastMonitored = field.last_monitored || field.updated;
        if (!lastMonitored) return false;
        return Date.now() - new Date(lastMonitored).getTime() < 1000 * 60 * 60 * 24 * 30;
      }).length,
    },
  };
}

function calculatePhAdjustment(input = {}) {
  const currentPh = Number(input.currentPh);
  const targetPh = Number(input.targetPh);
  const soilType = String(input.soilType || 'loam').toLowerCase();
  const areaSize = Number(input.areaSize || 1);
  const areaUnit = String(input.areaUnit || 'acre').toLowerCase();

  if (!Number.isFinite(currentPh) || !Number.isFinite(targetPh)) {
    throw new Error('currentPh and targetPh are required numbers');
  }

  if (currentPh < 3 || currentPh > 10 || targetPh < 3 || targetPh > 10) {
    throw new Error('pH values must be between 3.0 and 10.0');
  }

  if (!Number.isFinite(areaSize) || areaSize <= 0) {
    throw new Error('areaSize must be a positive number');
  }

  const delta = Number((targetPh - currentPh).toFixed(2));
  const absDelta = Math.abs(delta);

  const limeBase = {
    sandy: 1.2,
    loam: 1.8,
    clay: 2.4,
    silt: 2.0,
  };

  const sulfurBase = {
    sandy: 220,
    loam: 320,
    clay: 420,
    silt: 360,
  };

  const areaMultiplier = areaUnit === 'hectare' ? 2.47105 : 1;
  const acres = areaSize * areaMultiplier;

  if (absDelta < 0.1) {
    return {
      status: 'stable',
      currentPh,
      targetPh,
      delta,
      amendment: 'none',
      recommendation: 'Soil pH is already in the optimal band. Focus on monitoring and organic matter management.',
      monitoring: {
        retestInDays: 45,
        tips: [
          'Retest after 45 days or after heavy rainfall events.',
          'Track pH per field zone to catch localized drift early.',
        ],
      },
    };
  }

  const isRaisingPh = delta > 0;
  const amendment = isRaisingPh ? 'agricultural_lime' : 'elemental_sulfur';
  const unit = isRaisingPh ? 'tons' : 'kg';
  const baseRate = isRaisingPh
    ? (limeBase[soilType] || limeBase.loam)
    : (sulfurBase[soilType] || sulfurBase.loam);

  const quantity = isRaisingPh
    ? Number((acres * absDelta * baseRate).toFixed(2))
    : Number((acres * absDelta * baseRate).toFixed(1));

  const splitApplications = absDelta > 0.6 ? 2 : 1;
  const perSplit = Number((quantity / splitApplications).toFixed(isRaisingPh ? 2 : 1));

  return {
    status: 'adjustment_required',
    currentPh,
    targetPh,
    delta,
    amendment,
    quantity,
    unit,
    area: {
      size: areaSize,
      unit: areaUnit,
      normalizedAcres: Number(acres.toFixed(3)),
    },
    plan: {
      splitApplications,
      perSplit,
      cadenceDays: splitApplications > 1 ? 21 : 0,
      irrigationAdvice: 'Apply on moist soil and irrigate lightly after application for uniform incorporation.',
    },
    notes: [
      isRaisingPh
        ? 'Use fineness-adjusted agricultural lime for faster pH response.'
        : 'Use elemental sulfur and avoid over-application in one pass.',
      'Retest pH 30-45 days after final application before making the next correction.',
      'Blend recommendations with lab buffer pH results for precision at scale.',
    ],
  };
}

export default () => {
  const router = Router();

  router.use(async (req, _res, next) => {
    try {
      req.identity = await resolveRequestIdentity(req);
      next();
    } catch (error) {
      next(error);
    }
  });

  router.get('/farm/fields', async (req, res, next) => {
    try {
      const farmerId = getEffectiveFarmerId(req, req.identity);
      const scope = isAdmin(req.identity) && isAdminScope(req);
      const filter = scope ? '' : `farmer_id = "${farmerId}"`;
      const fields = await listRecords('fields', { filter });

      res.json({ status: 'ok', fields });
    } catch (error) {
      next(error);
    }
  });

  router.post('/farm/fields', async (req, res, next) => {
    try {
      const farmerId = getEffectiveFarmerId(req, req.identity);
      const payload = buildFieldPayload(req.body || {}, farmerId);
      const created = await pocketbaseClient.collection('fields').create(payload, { $autoCancel: false });

      res.status(201).json({ status: 'ok', field: created });
    } catch (error) {
      next(error);
    }
  });

  router.put('/farm/fields/:id', async (req, res, next) => {
    try {
      const farmerId = getEffectiveFarmerId(req, req.identity);
      const fieldId = ensureId(req.params.id);
      const current = await pocketbaseClient.collection('fields').getOne(fieldId, { $autoCancel: false });
      ensureRecordAccess(current, req.identity, 'field record');
      const payload = buildFieldPayload(req.body || {}, isAdmin(req.identity) ? (farmerId || current.farmer_id) : current.farmer_id, current);
      const updated = await pocketbaseClient.collection('fields').update(fieldId, payload, { $autoCancel: false });

      res.json({ status: 'ok', field: updated });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/farm/fields/:id', async (req, res, next) => {
    try {
      const fieldId = ensureId(req.params.id);
      const current = await pocketbaseClient.collection('fields').getOne(fieldId, { $autoCancel: false });
      ensureRecordAccess(current, req.identity, 'field record');
      await pocketbaseClient.collection('fields').delete(fieldId, { $autoCancel: false });

      res.json({ status: 'ok', deleted: true });
    } catch (error) {
      next(error);
    }
  });

  router.get('/farm/crops', async (req, res, next) => {
    try {
      const farmerId = getEffectiveFarmerId(req, req.identity);
      const scope = isAdmin(req.identity) && isAdminScope(req);
      const filter = scope ? '' : `farmer_id = "${farmerId}"`;
      const crops = await listRecords('crop_data', { filter });

      res.json({ status: 'ok', crops });
    } catch (error) {
      next(error);
    }
  });

  router.get('/farm/crop-management', async (req, res, next) => {
    try {
      const farmerId = getEffectiveFarmerId(req, req.identity);
      const scope = isAdmin(req.identity) && isAdminScope(req);
      const filter = scope ? '' : `farmer_id = "${farmerId}"`;
      const crops = await listRecords('crop_data', { filter });

      res.json({ status: 'ok', crops });
    } catch (error) {
      next(error);
    }
  });

  router.post('/farm/crops', async (req, res, next) => {
    try {
      const farmerId = getEffectiveFarmerId(req, req.identity);
      const payload = buildCropPayload(req.body || {}, farmerId);
      const created = await pocketbaseClient.collection('crop_data').create(payload, { $autoCancel: false });

      res.status(201).json({ status: 'ok', crop: created });
    } catch (error) {
      next(error);
    }
  });

  router.put('/farm/crops/:id', async (req, res, next) => {
    try {
      const farmerId = getEffectiveFarmerId(req, req.identity);
      const cropId = ensureId(req.params.id);
      const current = await pocketbaseClient.collection('crop_data').getOne(cropId, { $autoCancel: false });
      ensureRecordAccess(current, req.identity, 'crop record');
      const payload = buildCropPayload(req.body || {}, isAdmin(req.identity) ? (farmerId || current.farmer_id) : current.farmer_id, current);
      const updated = await pocketbaseClient.collection('crop_data').update(cropId, payload, { $autoCancel: false });

      res.json({ status: 'ok', crop: updated });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/farm/crops/:id', async (req, res, next) => {
    try {
      const cropId = ensureId(req.params.id);
      const current = await pocketbaseClient.collection('crop_data').getOne(cropId, { $autoCancel: false });
      ensureRecordAccess(current, req.identity, 'crop record');
      await pocketbaseClient.collection('crop_data').delete(cropId, { $autoCancel: false });

      res.json({ status: 'ok', deleted: true });
    } catch (error) {
      next(error);
    }
  });

  router.get('/farm/profile/:userId', async (req, res, next) => {
    try {
      const userId = ensureId(req.params.userId);
      if (!isAdmin(req.identity) && userId !== req.identity.id) {
        throw createHttpError(403, 'You can only access your own profile');
      }
      const profile = await pocketbaseClient.collection('users').getOne(userId, { $autoCancel: false });

      res.json({ status: 'ok', profile });
    } catch (error) {
      next(error);
    }
  });

  router.put('/farm/profile/:userId', async (req, res, next) => {
    try {
      const userId = ensureId(req.params.userId);
      if (!isAdmin(req.identity) && userId !== req.identity.id) {
        throw createHttpError(403, 'You can only update your own profile');
      }
      const payload = {
        name: normalizeText(req.body?.name),
        farm_name: normalizeText(req.body?.farm_name),
        region: normalizeText(req.body?.region),
      };
      const updated = await pocketbaseClient.collection('users').update(userId, payload, { $autoCancel: false });

      res.json({ status: 'ok', profile: updated });
    } catch (error) {
      next(error);
    }
  });

  router.get('/farm/performance', async (req, res, next) => {
    try {
      const farmerId = getEffectiveFarmerId(req, req.identity);
      const scope = isAdmin(req.identity) && isAdminScope(req);
      const filter = scope ? '' : `farmer_id = "${farmerId}"`;
      const [fields, crops] = await Promise.all([
        listRecords('fields', { filter }),
        listRecords('crop_data', { filter }),
      ]);
      const performance = calculatePerformance(fields, crops);

      res.json({
        status: 'ok',
        performance,
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/farm/ph/calculate', async (req, res, next) => {
    try {
      const result = calculatePhAdjustment(req.body || {});
      res.json({ status: 'ok', result });
    } catch (error) {
      next(error);
    }
  });

  router.get('/admin/overview', async (req, res, next) => {
    try {
      ensureAdmin(req.identity);

      const [
        totalUsers,
        totalFarmers,
        totalAdmins,
        totalFields,
        totalCrops,
        subsidySubmitted,
        subsidyUnderReview,
        subsidyApproved,
        subsidyRejected,
        subsidyPaid,
        activeAlerts,
        latestModelMetric,
        pocketbaseHealth,
      ] = await Promise.all([
        safeCollectionCall(() => countRecords('users'), 0),
        safeCollectionCall(() => countRecords('users', 'role = "farmer"'), 0),
        safeCollectionCall(() => countRecords('users', 'role = "admin"'), 0),
        safeCollectionCall(() => countRecords('fields'), 0),
        safeCollectionCall(() => countRecords('crop_data'), 0),
        safeCollectionCall(() => countRecords('subsidy_applications', 'status = "submitted"'), 0),
        safeCollectionCall(() => countRecords('subsidy_applications', 'status = "under_review"'), 0),
        safeCollectionCall(() => countRecords('subsidy_applications', 'status = "approved"'), 0),
        safeCollectionCall(() => countRecords('subsidy_applications', 'status = "rejected"'), 0),
        safeCollectionCall(() => countRecords('subsidy_applications', 'status = "paid"'), 0),
        safeCollectionCall(() => countRecords('regional_alerts', 'status = "active"'), 0),
        safeCollectionCall(async () => {
          const response = await pocketbaseClient.collection('model_metrics').getList(1, 1, {
            sort: '-updated',
            $autoCancel: false,
          });
          return response.items[0] || null;
        }, null),
        safeCollectionCall(() => checkPocketBaseHealth(), {
          connected: false,
          latencyMs: null,
          url: getPocketBaseRuntimeState().baseUrl,
          authenticated: getPocketBaseRuntimeState().authenticated,
          hasSuperuserCredentials: getPocketBaseRuntimeState().hasSuperuserCredentials,
        }),
      ]);

      const highConfidence = Number(latestModelMetric?.high_confidence_count || 0);
      const lowConfidence = Number(latestModelMetric?.low_confidence_count || 0);
      const totalPredictions = highConfidence + lowConfidence;
      const highConfidenceRate = totalPredictions > 0
        ? Number(((highConfidence / totalPredictions) * 100).toFixed(1))
        : null;

      res.json({
        status: 'ok',
        overview: {
          users: {
            total: totalUsers,
            farmers: totalFarmers,
            admins: totalAdmins,
          },
          operations: {
            fields: totalFields,
            crops: totalCrops,
            activeAlerts,
          },
          subsidy: {
            submitted: subsidySubmitted,
            underReview: subsidyUnderReview,
            approved: subsidyApproved,
            rejected: subsidyRejected,
            paid: subsidyPaid,
          },
          ml: {
            highConfidence,
            lowConfidence,
            highConfidenceRate,
            driftDetected: Boolean(latestModelMetric?.drift_detected),
            lastUpdated: toIsoDateOrNull(latestModelMetric?.updated),
          },
          services: {
            api: {
              status: 'up',
              env: apiConfig.nodeEnv,
              version: apiConfig.version,
            },
            pocketbase: {
              status: pocketbaseHealth.connected ? 'up' : 'degraded',
              latencyMs: pocketbaseHealth.latencyMs,
              url: pocketbaseHealth.url,
              authenticated: pocketbaseHealth.authenticated,
            },
          },
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/admin/users', async (req, res, next) => {
    try {
      ensureAdmin(req.identity);

      const limit = Math.max(1, Math.min(100, Number(req.query.limit || 30)));
      const page = Math.max(1, Number(req.query.page || 1));
      const q = String(req.query.q || '').trim();
      const safeQuery = q.replace(/"/g, '\\"');

      const filter = q
        ? `(name ~ "${safeQuery}" || email ~ "${safeQuery}" || farm_name ~ "${safeQuery}")`
        : '';

      const response = await pocketbaseClient.collection('users').getList(page, limit, {
        sort: '-updated',
        ...(filter ? { filter } : {}),
        $autoCancel: false,
      });

      res.json({
        status: 'ok',
        users: summarizeUsers(response.items),
        pagination: {
          page: response.page,
          perPage: response.perPage,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/admin/users/:id/role', async (req, res, next) => {
    try {
      ensureAdmin(req.identity);
      const userId = ensureId(req.params.id);
      const role = String(req.body?.role || '').trim().toLowerCase();

      if (!['admin', 'farmer'].includes(role)) {
        throw createHttpError(400, 'Role must be either "admin" or "farmer"');
      }

      if (userId === req.identity.id && role !== 'admin') {
        throw createHttpError(400, 'You cannot remove your own admin access');
      }

      const updated = await pocketbaseClient.collection('users').update(userId, { role }, { $autoCancel: false });

      res.json({
        status: 'ok',
        user: summarizeUsers([updated])[0],
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/admin/system-health', async (req, res, next) => {
    try {
      ensureAdmin(req.identity);
      const pocketbaseHealth = await safeCollectionCall(() => checkPocketBaseHealth(), {
        connected: false,
        latencyMs: null,
        url: getPocketBaseRuntimeState().baseUrl,
        authenticated: getPocketBaseRuntimeState().authenticated,
        hasSuperuserCredentials: getPocketBaseRuntimeState().hasSuperuserCredentials,
      });

      res.json({
        status: 'ok',
        health: {
          api: {
            status: 'up',
            env: apiConfig.nodeEnv,
            version: apiConfig.version,
          },
          pocketbase: {
            status: pocketbaseHealth.connected ? 'up' : 'degraded',
            latencyMs: pocketbaseHealth.latencyMs,
            url: pocketbaseHealth.url,
            authenticated: pocketbaseHealth.authenticated,
            hasSuperuserCredentials: pocketbaseHealth.hasSuperuserCredentials,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};