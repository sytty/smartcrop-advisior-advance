import { Router } from 'express';
import healthCheck from './health-check.js';
import pocketbaseHealth from './pocketbase-health.js';

export default () => {
    const router = Router();

    router.get('/health', healthCheck);
    router.get('/health/ready', pocketbaseHealth);
    router.get('/health/pocketbase', pocketbaseHealth);

    return router;
};
