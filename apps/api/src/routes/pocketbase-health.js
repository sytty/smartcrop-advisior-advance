import { ServiceStatus } from '../constants/common.js';
import { checkPocketBaseHealth, getPocketBaseRuntimeState } from '../utils/pocketbaseClient.js';

export default async (req, res) => {
    try {
        const pocketbase = await checkPocketBaseHealth();

        res.json({
            status: pocketbase.connected ? ServiceStatus.Ok : ServiceStatus.Degraded,
            requestId: req.context?.requestId || null,
            pocketbase,
        });
    } catch (error) {
        const runtimeState = getPocketBaseRuntimeState();

        res.status(503).json({
            status: ServiceStatus.Error,
            requestId: req.context?.requestId || null,
            pocketbase: {
                connected: false,
                latencyMs: null,
                ...runtimeState,
            },
            message: error?.message || 'PocketBase health check failed',
        });
    }
};
