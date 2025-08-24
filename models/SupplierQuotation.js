'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SupplierQuotation extends Model {
        static associate(models) {
            // Associations
            SupplierQuotation.belongsTo(models.PurchaseOrder, {
                foreignKey: 'purchase_order_id',
                as: 'purchaseOrder',
            });

            SupplierQuotation.belongsTo(models.Supplier, {
                foreignKey: 'supplier_id',
                as: 'supplier',
            });

            SupplierQuotation.belongsTo(models.User, {
                foreignKey: 'reviewed_by',
                as: 'reviewer',
            });

            SupplierQuotation.hasMany(models.SupplierQuotationItem, {
                foreignKey: 'quotation_id',
                as: 'items',
                onDelete: 'CASCADE',
            });
        }
    }

    SupplierQuotation.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quotation_number: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        purchase_order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        supplier_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quotation_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        valid_until: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        lead_time_days: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED'),
            allowNull: false,
            defaultValue: 'DRAFT',
        },
        subtotal: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        tax_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        discount_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        total_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        terms_and_conditions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        submitted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reviewed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reviewed_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        modelName: 'SupplierQuotation',
        tableName: 'supplier_quotations',
        underscored: true,
        timestamps: true,
    });

    return SupplierQuotation;
};
