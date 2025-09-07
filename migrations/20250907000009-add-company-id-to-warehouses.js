'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('warehouses', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Explicit index (optional, since Sequelize adds one automatically for FKs)
    await queryInterface.addIndex('warehouses', ['company_id']);
  },

  async down(queryInterface, Sequelize) {
    // First remove foreign key constraint
    await queryInterface.removeConstraint('warehouses', 'warehouses_company_id_fk')
      .catch(() => {}); // avoid breaking if constraint name differs

    // Then remove the column (drops FK + index if auto-created)
    await queryInterface.removeColumn('warehouses', 'company_id');
  }
};
