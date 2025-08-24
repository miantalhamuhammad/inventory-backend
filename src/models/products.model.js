import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Product extends Model {}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sku_code: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    barcode_number: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id',
        },
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'suppliers',
            key: 'id',
        },
    },
    weight: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: true,
    },
    weight_unit: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    dimensions: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    dimension_unit: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    purchasing_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    selling_price_margin: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    grn_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['sku_code'] },
        { fields: ['barcode_number'] },
        { fields: ['category_id'] },
        { fields: ['supplier_id'] },
    ],
});

export default Product;
