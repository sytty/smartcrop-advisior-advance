import { Router } from 'express';
import healthCheck from './health-check.js';
import pocketbaseHealth from './pocketbase-health.js';
import mlInferenceRoutes from './ml-inference.js';
import farmManagementRoutes from './farm-management.js';

export default () => {
    const router = Router();

    router.get('/health', healthCheck);
    router.get('/health/ready', pocketbaseHealth);
    router.get('/health/pocketbase', pocketbaseHealth);
    router.use(mlInferenceRoutes());
    router.use(farmManagementRoutes());

    return router;
};
