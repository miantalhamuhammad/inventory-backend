import logger from '../config/logger.js';
import { CustomError } from '../utils/custom-error.js';

const errorMiddleware = (err, req, res, _next) => {
    // Log the error
    const errorDetails = {
        timestamp: new Date().toISOString(),
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        ip: req.ip,
        body: req.body,
        params: req.params,
        query: req.query,
        user: req.user ? req.user.id : 'anonymous',
    };

    // Log error with appropriate level
    if (err.statusCode >= 500) {
        logger.error('Critical Error:', errorDetails);
    } else {
        logger.warn('Application Error:', errorDetails);
    }

    // Handle different types of errors
    if (err instanceof CustomError) {
        return res.errorRes(err.message, err.statusCode, err.errors);
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message,
        }));
        return res.validationRes(validationErrors);
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.validationRes([{
            field,
            message: `${field} already exists`,
        }]);
    }

    // Handle CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.errorRes(`Invalid ${err.path}: ${err.value}`, 400);
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.unauthorizedRes('Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        return res.unauthorizedRes('Token expired');
    }

    // Handle rate limit errors
    if (err.status === 429) {
        return res.errorRes('Too many requests, please try again later', 429);
    }

    // Default error response for unhandled errors
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error';

    return res.errorRes(message, statusCode);
};

export default errorMiddleware;