import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class SaleOrder extends Model {}

SaleOrder.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    so_number: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customers',
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
    order_date: {
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
        type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        defaultValue: 'PENDING',
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    tax_amount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00,
        allowNull: false,
    },
    discount_amount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00,
        allowNull: false,
    },
    shipping_amount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.ENUM('PENDING', 'PARTIAL', 'PAID', 'REFUNDED'),
        defaultValue: 'PENDING',
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
}, {
    sequelize,
    modelName: 'SaleOrder',
    tableName: 'sale_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['so_number'] },
        { fields: ['customer_id'] },
        { fields: ['warehouse_id'] },
        { fields: ['status'] },
        { fields: ['order_date'] },
        { fields: ['payment_status'] },
    ],
});

// Add a helper method to update status
SaleOrder.updateStatus = async function (id, newStatus) {
    return await this.update({ status: newStatus }, { where: { id } });
};

export default SaleOrder;
