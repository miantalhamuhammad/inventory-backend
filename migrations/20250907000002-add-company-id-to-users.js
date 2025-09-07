'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Explicit index (name it so we can remove it later)
    await queryInterface.addIndex('users', ['company_id'], {
      name: 'users_company_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove FK constraint first (constraint name may differ, so catch errors)
    await queryInterface.removeConstraint('users', 'users_company_id_fk')
      .catch(() => {});

    // Remove the named index (if explicitly created)
    await queryInterface.removeIndex('users', 'users_company_id_idx')
      .catch(() => {});

    // Finally remove the column
    await queryInterface.removeColumn('users', 'company_id');
  }
};
