'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('departments', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Explicit index (optional, since FKs auto-create one)
    await queryInterface.addIndex('departments', ['company_id'], {
      name: 'departments_company_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove FK constraint first (name may differ, so catch errors)
    await queryInterface.removeConstraint('departments', 'departments_company_id_fk')
      .catch(() => {});

    // Remove the explicitly named index
    await queryInterface.removeIndex('departments', 'departments_company_id_idx')
      .catch(() => {});

    // Remove the column (drops any FK/implicit index left behind)
    await queryInterface.removeColumn('departments', 'company_id');
  }
};
