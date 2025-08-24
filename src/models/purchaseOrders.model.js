import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class PurchaseOrder extends Model {}

PurchaseOrder.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  po_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'suppliers',
      key: 'id'
    }
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'warehouses',
      key: 'id'
    }
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  expected_delivery_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'partially_received', 'received', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  payment_terms: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // shipping_address: {
  //   type: DataTypes.TEXT,
  //   allowNull: true
  // },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'PurchaseOrder',
  tableName: 'purchase_orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default PurchaseOrder;
