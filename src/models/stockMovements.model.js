import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class StockMovement extends Model {}

StockMovement.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id',
        },
    },
    warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'warehouses',
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    movement_type: {
        type: DataTypes.ENUM('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'),
        allowNull: false,
    },
    reference_type: {
        type: DataTypes.ENUM('PURCHASE', 'SALE', 'TRANSFER', 'ADJUSTMENT', 'RETURN'),
        allowNull: true,
    },
    reference_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'StockMovement',
    tableName: 'stock_movements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { fields: ['product_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['movement_type'] },
        { fields: ['reference_type', 'reference_id'] },
        { fields: ['created_at'] },
    ],
});

export default StockMovement;
