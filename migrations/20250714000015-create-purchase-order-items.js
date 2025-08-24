'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('purchase_order_items', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            purchase_order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'purchase_orders',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            unit_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            total_price: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                // Will be calculated as quantity * unit_price
            },
            received_quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
        });

        // Add indexes
        await queryInterface.addIndex('purchase_order_items', ['purchase_order_id'], {
            name: 'idx_po_items_purchase_order_id',
        });
        await queryInterface.addIndex('purchase_order_items', ['product_id'], {
            name: 'idx_po_items_product_id',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('purchase_order_items');
    },
};
