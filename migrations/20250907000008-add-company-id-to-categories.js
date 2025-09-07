'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Optional: if you want a custom index name, otherwise FK already creates one
    await queryInterface.addIndex('categories', ['company_id'], {
      name: 'categories_company_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove constraint first (name might differ, adjust if needed)
    await queryInterface.removeConstraint('categories', 'categories_company_id_fk')
      .catch(() => {});

    // Remove the extra index if you explicitly created it
    await queryInterface.removeIndex('categories', 'categories_company_id_idx')
      .catch(() => {});

    // Finally, remove the column
    await queryInterface.removeColumn('categories', 'company_id');
  }
};
