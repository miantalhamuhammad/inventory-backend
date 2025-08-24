import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';
import 'winston-daily-rotate-file';

// Get the current file's directory equivalent to __dirname
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

// Define and create the log directory
const logDir = path.join(__dirname, '../../logs');
fs.mkdirSync(logDir, { recursive: true });

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
    ),
    transports: [
        // Write error logs with rotation
        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m', // Rotate when file reaches 20MB
            maxFiles: '14d', // Keep logs for 14 days
            format: winston.format.json(),
        }),
        // Write all logs with rotation
        new winston.transports.DailyRotateFile({
            filename: path.join(logDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m', // Rotate when file reaches 20MB
            maxFiles: '14d', // Keep logs for 14 days
            format: winston.format.json(),
        }),
    ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ),
    }));
}

export default logger;