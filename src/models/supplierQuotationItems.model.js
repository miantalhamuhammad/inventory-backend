import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class SupplierQuotationItem extends Model {}

SupplierQuotationItem.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  quotation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'supplier_quotations',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  specifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'SupplierQuotationItem',
  tableName: 'supplier_quotation_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default SupplierQuotationItem;
