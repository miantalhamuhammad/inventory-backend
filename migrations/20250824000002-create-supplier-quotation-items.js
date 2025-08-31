'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('supplier_quotation_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quotation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'supplier_quotations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      total_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      specifications: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: true
      },
      model: {
        type: Sequelize.STRING,
        allowNull: true
      },
      warranty_period: {
        type: Sequelize.STRING,
        allowNull: true
      },
      delivery_timeline: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
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
    await queryInterface.addIndex('supplier_quotation_items', ['quotation_id']);
    await queryInterface.addIndex('supplier_quotation_items', ['product_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('supplier_quotation_items');
  }
};
