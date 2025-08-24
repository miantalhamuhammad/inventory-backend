import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class SaleOrderItem extends Model {}

SaleOrderItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total_price: {
        type: DataTypes.VIRTUAL,
        get() {
            return parseFloat(this.quantity) * parseFloat(this.unit_price);
        },
    },
    shipped_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'SaleOrderItem',
    tableName: 'sale_order_items',
    timestamps: false,
    indexes: [
        { fields: ['sale_order_id'] },
        { fields: ['product_id'] },
    ],
});

export default SaleOrderItem;
