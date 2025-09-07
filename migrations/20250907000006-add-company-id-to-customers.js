'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('customers', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Explicitly name the index (so it can be dropped cleanly later)
    await queryInterface.addIndex('customers', ['company_id'], {
      name: 'customers_company_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove FK constraint first (name may differ, so catch errors)
    await queryInterface.removeConstraint('customers', 'customers_company_id_fk')
      .catch(() => {});

    // Remove the custom index (if created explicitly)
    await queryInterface.removeIndex('customers', 'customers_company_id_idx')
      .catch(() => {});

    // Finally remove the column
    await queryInterface.removeColumn('customers', 'company_id');
  }
};
