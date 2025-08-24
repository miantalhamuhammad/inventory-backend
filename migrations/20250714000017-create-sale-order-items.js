'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sale_order_items', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            sale_order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'sale_orders',
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
            },
            shipped_quantity: {
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
        await queryInterface.addIndex('sale_order_items', ['sale_order_id'], {
            name: 'idx_so_items_sale_order_id',
        });
        await queryInterface.addIndex('sale_order_items', ['product_id'], {
            name: 'idx_so_items_product_id',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('sale_order_items');
    },
};
