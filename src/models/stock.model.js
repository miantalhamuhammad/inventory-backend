import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Stock extends Model {}

Stock.init({
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
    batch_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    recorded_stock_level: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    minimum_stock_level: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    maximum_stock_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    warning_threshold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    auto_order_level: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    reorder_point: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    stock_condition: {
        type: DataTypes.ENUM('NEW', 'USED', 'DAMAGED', 'EXPIRED'),
        defaultValue: 'NEW',
        allowNull: false,
    },
    expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Stock',
    tableName: 'stock',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['product_id', 'warehouse_id'] },
        { fields: ['batch_number'] },
        { fields: ['quantity'] },
        { fields: ['expiry_date'] },
    ],
});

export default Stock;
