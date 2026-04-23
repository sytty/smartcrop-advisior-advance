import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import apiConfig from './config/env.js';
import routes from './routes/index.js';
import { errorMiddleware, globalRateLimit, requestContext } from './middleware/index.js';
import logger from './utils/logger.js';

const app = express();
let server;

process.on('uncaughtException', (error) => {
	logger.fatal('Uncaught exception', error);
});
  
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled rejection', { promise, reason });
});

async function shutdown(signal) {
	logger.info('Shutdown signal received', { signal });

	if (!server) {
		process.exit(0);
		return;
	}

	server.close((error) => {
		if (error) {
			logger.error('Error while shutting down the API server', error);
			process.exit(1);
			return;
		}

		logger.info('API server stopped cleanly');
		process.exit(0);
	});
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

app.disable('x-powered-by');
app.set('trust proxy', apiConfig.trustProxy);

app.use(helmet({
	crossOriginResourcePolicy: false,
}));
app.use(cors({
	origin: apiConfig.corsOrigins === '*'
		? true
		: (origin, callback) => {
			if (!origin || apiConfig.corsOrigins.includes(origin)) {
				callback(null, true);
				return;
			}

			callback(new Error(`Origin not allowed by CORS: ${origin}`));
		},
	credentials: true,
}));
morgan.token('request-id', (req) => req.context?.requestId || 'n/a');
app.use(requestContext);
app.use(globalRateLimit);
app.use(morgan(':method :url :status :response-time ms request-id=:request-id'));
app.use(express.json({ limit: apiConfig.bodyLimit }));
app.use(express.urlencoded({ extended: true }));

app.use('/', routes());
app.use('/hcgi/api', routes());

app.use(errorMiddleware);

app.use((req, res) => {
	res.status(404).json({
		status: 'error',
		requestId: req.context?.requestId || null,
		message: 'Route not found',
	});
});

server = app.listen(apiConfig.port, () => {
	logger.info('API server running', {
		url: `http://localhost:${apiConfig.port}`,
		env: apiConfig.nodeEnv,
		version: apiConfig.version,
	});
});

export default app;
