import http from 'http';
import dotenv from 'dotenv';
dotenv.config(); // loads default `.env`
import app from './src/app.js';
import { connectDB } from './src/config/dbconfig.js';
import logger from './src/config/logger.js';


const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

// Initialize database connection and start server
const startServer = async () => {
    try {
        // Connect to MySQL database using Sequelize
        await connectDB();

        // Start the Express server
        server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
            logger.info(`Health check available at: http://localhost:${PORT}/health`);
            logger.info(`API endpoints available at: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown handling
const gracefulShutdown = () => {
    logger.info('Starting graceful shutdown...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });

};

// Event handlers
process.on('SIGTERM', () => {
    logger.info('Received SIGTERM signal');
    gracefulShutdown();
});

process.on('SIGINT', () => {
    logger.info('Received SIGINT signal');
    gracefulShutdown();
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', {
        error: error.message,
        stack: error.stack,
        name: error.name,
    });
    gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection:', {
        reason: reason instanceof Error ? reason.message : reason,
        stack: reason instanceof Error ? reason.stack : undefined,
        promise,
    });
    gracefulShutdown();
});

// Start the server
startServer();