'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('stock', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            warehouse_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'warehouses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            batch_number: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            unit_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            recorded_stock_level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            minimum_stock_level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            maximum_stock_level: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            warning_threshold: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            auto_order_level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            reorder_point: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            stock_condition: {
                type: Sequelize.ENUM('NEW', 'USED', 'DAMAGED', 'EXPIRED'),
                allowNull: false,
                defaultValue: 'NEW',
            },
            expiry_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add indexes
        await queryInterface.addIndex('stock', ['product_id', 'warehouse_id'], {
            name: 'idx_stock_product_warehouse',
        });
        await queryInterface.addIndex('stock', ['batch_number'], {
            name: 'idx_stock_batch',
        });
        await queryInterface.addIndex('stock', ['quantity'], {
            name: 'idx_stock_quantity',
        });
        await queryInterface.addIndex('stock', ['expiry_date'], {
            name: 'idx_stock_expiry',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('stock');
    },
};
