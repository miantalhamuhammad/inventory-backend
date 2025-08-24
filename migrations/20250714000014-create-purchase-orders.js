'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('purchase_orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            po_number: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            supplier_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'suppliers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            warehouse_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'warehouses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            order_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            expected_delivery_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            actual_delivery_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            subtotal: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
            },
            tax_amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            discount_amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            total_amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                // Note: In migration, we'll calculate this with a trigger or update it programmatically
            },
            payment_terms: {
                type: Sequelize.STRING(100),
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
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add indexes
        await queryInterface.addIndex('purchase_orders', ['po_number'], {
            name: 'idx_purchase_orders_po_number',
        });
        await queryInterface.addIndex('purchase_orders', ['supplier_id'], {
            name: 'idx_purchase_orders_supplier_id',
        });
        await queryInterface.addIndex('purchase_orders', ['warehouse_id'], {
            name: 'idx_purchase_orders_warehouse_id',
        });
        await queryInterface.addIndex('purchase_orders', ['status'], {
            name: 'idx_purchase_orders_status',
        });
        await queryInterface.addIndex('purchase_orders', ['order_date'], {
            name: 'idx_purchase_orders_order_date',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('purchase_orders');
    },
};
