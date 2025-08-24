'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SupplierQuotationItem extends Model {
        static associate(models) {
            // Associations
            SupplierQuotationItem.belongsTo(models.SupplierQuotation, {
                foreignKey: 'quotation_id',
                as: 'quotation',
            });

            SupplierQuotationItem.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product',
            });
        }
    }

    SupplierQuotationItem.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quotation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        total_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        specifications: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        brand: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        model: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        warranty_period: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        delivery_timeline: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        remarks: {
            type: DataTypes.TEXT,
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
        modelName: 'SupplierQuotationItem',
        tableName: 'supplier_quotation_items',
        underscored: true,
        timestamps: true,
    });

    return SupplierQuotationItem;
};
