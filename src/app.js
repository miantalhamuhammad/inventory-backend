import express from 'express';
import cors from 'cors';
import compression from 'compression';
import xssClean from 'xss-clean';
import helmet from 'helmet';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';
import loggerMiddleware from './middlewares/loggerMiddleware.js';
import logger from './config/logger.js';
import router from './routes/index.js';
import ResponseMiddleware from './middlewares/responseMiddleware.js';
import errorMiddleware from './middlewares/error-handler.js';
import { NotFoundError } from './utils/custom-error.js';
import os from 'os';
// Import models
import models from './models/index.js';


const app = express();

// Attach models to app instance
app.set('models', models);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Security Middlewares
app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(xssClean());
// Performance Middleware
app.use(compression());


// Rate limiter configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Increased limit for API usage
    handler: (req, _res, next) => {
        const error = new Error('Too many requests from this IP, please try again later');
        error.status = 429;
        logger.warn('Rate limit exceeded:', {
            ip: req.ip,
            path: req.path,
            method: req.method,
            headers: req.headers,
        });
        next(error);
    },
});

// Apply rate limiting
app.use('/api/', limiter);

// File upload middleware
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50mb
    },
}));

// Custom response middleware
app.use(ResponseMiddleware);

// Logger middleware
app.use(loggerMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        system: {
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
        },
    });
});

// API routes
app.use('/api', router);

// Handle 404 for unknown routes
app.all('*', (req, res, next) => {
    const err = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(err);
});

// Global error handler
app.use(errorMiddleware);

export default app;