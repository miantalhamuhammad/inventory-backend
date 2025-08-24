import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Customer extends Model {}

Customer.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    customer_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    customer_id: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    zip_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    tax_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    credit_limit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    payment_terms: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    customer_type: {
        type: DataTypes.ENUM('INDIVIDUAL', 'BUSINESS'),
        defaultValue: 'INDIVIDUAL',
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['customer_id'] },
        { fields: ['email'] },
        { fields: ['customer_name'] },
        { fields: ['customer_type'] },
    ],
});

export default Customer;
