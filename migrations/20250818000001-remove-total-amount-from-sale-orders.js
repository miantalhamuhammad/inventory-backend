// Migration to remove total_amount column from sale_orders table
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('sale_orders', 'total_amount');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_orders', 'total_amount', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
    });
  },
};

