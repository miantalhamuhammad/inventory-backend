'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Explicit index (optional, since FKs create one automatically)
    await queryInterface.addIndex('products', ['company_id'], {
      name: 'products_company_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove FK constraint first (name may vary, so catch errors)
    await queryInterface.removeConstraint('products', 'products_company_id_fk')
      .catch(() => {});

    // Remove custom index if you explicitly created it
    await queryInterface.removeIndex('products', 'products_company_id_idx')
      .catch(() => {});

    // Remove the column (drops any implicit index as well)
    await queryInterface.removeColumn('products', 'company_id');
  }
};
