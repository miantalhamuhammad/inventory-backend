'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('employees', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Explicitly name the index so it's easy to drop later
    await queryInterface.addIndex('employees', ['company_id'], {
      name: 'employees_company_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove FK constraint first (name may vary, so catch errors)
    await queryInterface.removeConstraint('employees', 'employees_company_id_fk')
      .catch(() => {});

    // Remove the named index
    await queryInterface.removeIndex('employees', 'employees_company_id_idx')
      .catch(() => {});

    // Finally, remove the column
    await queryInterface.removeColumn('employees', 'company_id');
  }
};
