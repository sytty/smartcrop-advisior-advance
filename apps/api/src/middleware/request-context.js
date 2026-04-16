import { randomUUID } from 'node:crypto';
import logger from '../utils/logger.js';

function requestContext(req, res, next) {
  const requestId = req.headers['x-request-id'] || randomUUID();
  const startedAt = Date.now();

  req.context = {
    requestId,
    startedAt,
  };

  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    logger.info('Request completed', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
}

export default requestContext;
export { requestContext };
