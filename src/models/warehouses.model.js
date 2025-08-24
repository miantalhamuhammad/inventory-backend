import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Warehouse extends Model {}

Warehouse.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    warehouse_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    warehouse_id: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id',
        },
    },
    contact_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Warehouse',
    tableName: 'warehouses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['warehouse_id'] },
        { fields: ['manager_id'] },
    ],
});

export default Warehouse;
