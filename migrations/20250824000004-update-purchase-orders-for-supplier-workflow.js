'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // For MySQL, we need to modify the column directly instead of using ALTER TYPE
        // First, let's modify the purchase_orders table to update the status enum
        await queryInterface.changeColumn('purchase_orders', 'status', {
            type: Sequelize.ENUM(
                'PENDING',
                'CONFIRMED',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED',
                'QUOTATION_REQUESTED',
                'QUOTATION_RECEIVED',
                'QUOTATION_APPROVED'
            ),
            allowNull: false,
            defaultValue: 'PENDING',
        });

        // Add quotation_deadline column for suppliers to know when to submit quotations
        await queryInterface.addColumn('purchase_orders', 'quotation_deadline', {
            type: Sequelize.DATEONLY,
            allowNull: true,
        });

        // Add priority column
        await queryInterface.addColumn('purchase_orders', 'priority', {
            type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
            allowNull: false,
            defaultValue: 'MEDIUM',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('purchase_orders', 'quotation_deadline');
        await queryInterface.removeColumn('purchase_orders', 'priority');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_purchase_orders_priority";');

        // Revert the status enum to original values
        await queryInterface.changeColumn('purchase_orders', 'status', {
            type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PENDING',
        });
    },
};
