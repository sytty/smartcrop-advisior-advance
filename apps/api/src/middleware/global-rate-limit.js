import apiConfig from '../config/env.js';

const buckets = new Map();
const cleanupIntervalMs = Math.max(apiConfig.rateLimit.windowMs, 60 * 1000);

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, cleanupIntervalMs).unref();

function globalRateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.headers['x-forwarded-for'] || 'anonymous';
  const current = buckets.get(key);

  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + apiConfig.rateLimit.windowMs }
    : current;

  bucket.count += 1;
  buckets.set(key, bucket);

  const remaining = Math.max(apiConfig.rateLimit.maxRequests - bucket.count, 0);
  const resetInSeconds = Math.ceil((bucket.resetAt - now) / 1000);

  res.setHeader('RateLimit-Limit', apiConfig.rateLimit.maxRequests);
  res.setHeader('RateLimit-Remaining', remaining);
  res.setHeader('RateLimit-Reset', resetInSeconds);

  if (bucket.count > apiConfig.rateLimit.maxRequests) {
    res.status(429).json({
      status: 'error',
      requestId: req.context?.requestId || null,
      message: 'Too many requests, please try again later.',
      retryAfterSeconds: resetInSeconds,
    });
    return;
  }

  next();
}

export default globalRateLimit;
export { globalRateLimit };
