import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Shipment extends Model {}

Shipment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    shipment_number: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    sale_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sale_orders',
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
    carrier_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    tracking_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    shipping_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    expected_delivery_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    actual_delivery_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('PREPARING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PREPARING',
        allowNull: false,
    },
    shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false,
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
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Shipment',
    tableName: 'shipments',
    timestamps: false,
});

export default Shipment;
