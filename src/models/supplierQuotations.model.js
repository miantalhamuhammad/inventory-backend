import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class SupplierQuotation extends Model {}

SupplierQuotation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  quotation_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  purchase_order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'purchase_orders',
      key: 'id'
    }
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'suppliers',
      key: 'id'
    }
  },
  quotation_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false
  },
  lead_time_days: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  tax_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  discount_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
      allowNull: false
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED'),
    allowNull: false,
    defaultValue: 'DRAFT'
  },
  terms_and_conditions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'SupplierQuotation',
  tableName: 'supplier_quotations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeValidate: async (quotation) => {
      if (!quotation.quotation_number) {
        // Generate quotation number only if it doesn't exist
        quotation.quotation_number = await generateQuotationNumber();
      }
    }
  }
});
// Function to generate quotation number for MySQL
async function generateQuotationNumber() {
  const prefix = 'SQ';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');

  try {
    // Find the latest quotation for this year and month using MySQL LIKE
    const latestQuotation = await SupplierQuotation.findOne({
      where: {
        quotation_number: {
          [Op.like]: `${prefix}${year}${month}%`
        }
      },
      order: [['quotation_number', 'DESC']]
    });

    let sequentialNumber = 1;
    if (latestQuotation) {
      // Extract the sequential number from the latest quotation
      const latestNumber = latestQuotation.quotation_number;
      const parts = latestNumber.split('-');

      if (parts.length > 1) {
        // Format: SQYYYYMM-0001
        sequentialNumber = parseInt(parts[1], 10) + 1;
      } else {
        // Fallback: extract from the end of the string
        const numPart = latestNumber.slice(-4);
        sequentialNumber = parseInt(numPart, 10) + 1;
      }
    }

    // Format: SQYYYYMM-0001
    return `${prefix}${year}${month}-${String(sequentialNumber).padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generating quotation number:', error);
    // Fallback: timestamp-based number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `SQ-${timestamp}-${String(random).padStart(3, '0')}`;
  }
}
export default SupplierQuotation;
