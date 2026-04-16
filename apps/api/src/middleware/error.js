import logger from '../utils/logger.js';
import { NodeEnv } from '../constants/common.js';

const errorMiddleware = (err, req, res, next) => {
	const statusCode = Number.isInteger(err?.statusCode) ? err.statusCode : 500;
	const requestId = req.context?.requestId || null;

	logger.error('Request failed', {
		requestId,
		method: req.method,
		path: req.originalUrl,
		statusCode,
		error: err,
	});

	if (res.headersSent) {
		return next(err);
	}

	res.status(statusCode).json({
		status: 'error',
		requestId,
		message: statusCode >= 500 ? 'Internal server error' : err.message,
		...(process.env.NODE_ENV !== NodeEnv.Production && {
			error: {
				name: err.name,
				message: err.message,
				stack: err.stack,
			},
		}),
	});
};

export default errorMiddleware;
export { errorMiddleware };
