'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add missing columns to supplier_quotations table
    await queryInterface.addColumn('supplier_quotations', 'review_notes', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('supplier_quotations', 'review_notes');
  }
};
