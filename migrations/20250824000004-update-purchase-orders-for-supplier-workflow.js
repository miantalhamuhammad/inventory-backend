'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
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
        // Remove added columns first (these should work without issues)
        try {
            await queryInterface.removeColumn('purchase_orders', 'quotation_deadline');
        } catch (error) {
            console.log('quotation_deadline column may not exist:', error.message);
        }

        try {
            await queryInterface.removeColumn('purchase_orders', 'priority');
        } catch (error) {
            console.log('priority column may not exist:', error.message);
        }

        // For the status ENUM, we need to be more careful with MySQL
        // First update any records that have new status values
        try {
            await queryInterface.sequelize.query(
                "UPDATE purchase_orders SET status = 'PENDING' WHERE status IN ('QUOTATION_REQUESTED', 'QUOTATION_RECEIVED', 'QUOTATION_APPROVED')"
            );
        } catch (error) {
            console.log('Status update may have failed:', error.message);
        }

        // Then modify the column to remove the new enum values
        try {
            await queryInterface.changeColumn('purchase_orders', 'status', {
                type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
            });
        } catch (error) {
            console.log('Status column revert may have failed:', error.message);
        }
    },
};
