'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('supplier_quotations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quotation_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      purchase_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'purchase_orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quotation_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      valid_until: {
        type: Sequelize.DATE,
        allowNull: false
      },
      lead_time_days: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      tax_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      discount_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      terms_and_conditions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED'),
        allowNull: false,
        defaultValue: 'DRAFT'
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      reviewed_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      review_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('supplier_quotations', ['purchase_order_id']);
    await queryInterface.addIndex('supplier_quotations', ['supplier_id']);
    await queryInterface.addIndex('supplier_quotations', ['status']);
    await queryInterface.addIndex('supplier_quotations', ['quotation_date']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('supplier_quotations');
  }
};
