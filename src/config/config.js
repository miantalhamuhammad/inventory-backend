import path from 'path';
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });



// Add error handling for required environment variables
const requiredEnvVars = [
    'APP_NAME', 'FRONT_END_URL', 'APP_DESCRIPTION', 'APP_VERSION',
    'APP_DEBUG', 'DB_USER', 'DB_PREFIX', 'DB_PASS', 'DB_HOST', 'DB_PORT',
    'DB_NAME', 'DB_DIALECT', 'JWT_EXPIRY_TIME', 'JWT_SECRET', 'SALT_ROUNDS',
    'DB_LOGGING',
];

requiredEnvVars.forEach(varName => {

    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

const isDev = process.env.NODE_ENV === 'development';

// Refactor database configuration
const dbConfig = {
    user: process.env.DB_USER,
    prefix: process.env.DB_PREFIX,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGGING === 'true',
    pool: {
        max: parseInt(process.env.DB_POOL_MAX, 10) || 10, // Maximum number of connections in the pool
        min: parseInt(process.env.DB_POOL_MIN, 10) || 1, // Minimum number of connections in the pool
        acquire: 30000, // Max time (ms) to try getting a connection before throwing an error
        idle: 10000, // Time (ms) before a connection is released
    },
};

const appConfig = {
    app_name: process.env.APP_NAME,
    frontendURL: process.env.FRONT_END_URL,
    appDescription: process.env.APP_DESCRIPTION,
    appURL: process.env.APP_URL || '',
    baseURL: process.env.BASE_URL || '',
    app_version: process.env.APP_VERSION,
    app_debug: process.env.APP_DEBUG,
    avatar: process.env.DEFAULT_AVATAR || '',
    isDev,
    db: dbConfig,
    crypto: {
        secret: process.env.CRYPTO_SECRET,
    },
    // JWT Configuration
    jwt: {
        expiryTime: process.env.JWT_EXPIRY_TIME,
        secret: process.env.JWT_SECRET,
    },
    bcrypt: {
        saltRounds: process.env.SALT_ROUNDS,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        s3: {
            bucketName: process.env.BUCKET_NAME,// Name of the S3 bucket
            bucketRegion: process.env.BUCKET_REGION, // Region of the S3 bucket
        },
    },
};

export default appConfig;