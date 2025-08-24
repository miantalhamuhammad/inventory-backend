import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Invoice extends Model {}

Invoice.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    invoice_number: {
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
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'id',
        },
    },
    invoice_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATEONLY,
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
    total_amount: {
        type: DataTypes.VIRTUAL,
        get() {
            return parseFloat(this.subtotal) + parseFloat(this.tax_amount) - parseFloat(this.discount_amount);
        },
    },
    paid_amount: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00,
        allowNull: false,
    },
    balance: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.total_amount - parseFloat(this.paid_amount);
        },
    },
    status: {
        type: DataTypes.ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'),
        defaultValue: 'DRAFT',
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
    modelName: 'Invoice',
    tableName: 'invoices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['invoice_number'] },
        { fields: ['sale_order_id'] },
        { fields: ['customer_id'] },
        { fields: ['status'] },
        { fields: ['due_date'] },
    ],
});

export default Invoice;
