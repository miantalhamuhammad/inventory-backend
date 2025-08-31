'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // Add user_id column to suppliers table for authentication linkage
        await queryInterface.addColumn('suppliers', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });

        // Add index for user_id
        await queryInterface.addIndex('suppliers', ['user_id'], {
            name: 'idx_suppliers_user_id',
        });

        // Add status column to track supplier account status
        await queryInterface.addColumn('suppliers', 'status', {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'PENDING_APPROVAL', 'SUSPENDED'),
            allowNull: false,
            defaultValue: 'PENDING_APPROVAL',
        });
    },

  async down(queryInterface, Sequelize) {
    // Remove status column if exists
    const table = await queryInterface.describeTable('suppliers');
    if (table.status) {
      await queryInterface.removeColumn('suppliers', 'status');
    }

    // Drop enum type (for Postgres only)
    if (queryInterface.sequelize.options.dialect === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_suppliers_status";');
    }

    // Remove index if exists
    try {
      await queryInterface.removeIndex('suppliers', 'idx_suppliers_user_id');
    } catch (e) {
      console.warn('Index idx_suppliers_user_id does not exist, skipping.');
    }

    // Remove user_id column if exists
    if (table.user_id) {
      await queryInterface.removeColumn('suppliers', 'user_id');
    }
  },
};
