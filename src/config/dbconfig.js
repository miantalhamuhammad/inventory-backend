import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Create Sequelize instance for MySQL
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307, // Updated to match Docker port
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'invento',
    pool: {
        max: 10,
        min: 0,
        acquire: 60000,
        idle: 10000,
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

const connectDB = async () => {
    try {
        console.log('Attempting to connect to the database...');
        console.log({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            name: process.env.DB_NAME,
        });
        await sequelize.authenticate();
        console.log('MySQL Connected with Sequelize');
        console.log('Connection test successful!');
    } catch (error) {
        console.error('Database Connection Error:', error);
        process.exit(1);
    }
};

export { sequelize, connectDB };
export default sequelize;
