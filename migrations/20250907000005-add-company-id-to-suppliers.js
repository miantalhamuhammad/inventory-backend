'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('suppliers', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Explicitly name the index for clean removal later
    await queryInterface.addIndex('suppliers', ['company_id'], {
      name: 'suppliers_company_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove FK constraint first (constraint name may vary, so catch errors)
    await queryInterface.removeConstraint('suppliers', 'suppliers_company_id_fk')
      .catch(() => {});

    // Remove the custom index (only if explicitly created above)
    await queryInterface.removeIndex('suppliers', 'suppliers_company_id_idx')
      .catch(() => {});

    // Finally, remove the column
    await queryInterface.removeColumn('suppliers', 'company_id');
  }
};
