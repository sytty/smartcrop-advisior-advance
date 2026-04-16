import apiConfig from '../config/env.js';

export default async (req, res) => {
    res.json({
        status: 'ok',
        service: 'api',
        version: apiConfig.version,
        env: apiConfig.nodeEnv,
        timestamp: new Date().toISOString(),
        uptimeMs: Math.round(process.uptime() * 1000),
        requestId: req.context?.requestId || null,
    });
};
