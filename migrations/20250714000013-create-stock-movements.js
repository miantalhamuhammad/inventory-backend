'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('stock_movements', {
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
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            movement_type: {
                type: Sequelize.ENUM('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'),
                allowNull: false,
            },
            reference_type: {
                type: Sequelize.ENUM('PURCHASE', 'SALE', 'TRANSFER', 'ADJUSTMENT', 'RETURN'),
                allowNull: true,
            },
            reference_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add indexes
        await queryInterface.addIndex('stock_movements', ['product_id'], {
            name: 'idx_stock_movements_product_id',
        });
        await queryInterface.addIndex('stock_movements', ['warehouse_id'], {
            name: 'idx_stock_movements_warehouse_id',
        });
        await queryInterface.addIndex('stock_movements', ['movement_type'], {
            name: 'idx_stock_movements_type',
        });
        await queryInterface.addIndex('stock_movements', ['reference_type', 'reference_id'], {
            name: 'idx_stock_movements_reference',
        });
        await queryInterface.addIndex('stock_movements', ['created_at'], {
            name: 'idx_stock_movements_created_at',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('stock_movements');
    },
};
