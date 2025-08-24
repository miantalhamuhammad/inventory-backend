'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
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
        await queryInterface.removeIndex('suppliers', 'idx_suppliers_user_id');
        await queryInterface.removeColumn('suppliers', 'user_id');
        await queryInterface.removeColumn('suppliers', 'status');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_suppliers_status";');
    },
};
