'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sale_orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            so_number: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            customer_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'customers',
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
                type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
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
            shipping_amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            total_amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
            },
            payment_status: {
                type: Sequelize.ENUM('PENDING', 'PARTIAL', 'PAID', 'REFUNDED'),
                allowNull: false,
                defaultValue: 'PENDING',
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
        await queryInterface.addIndex('sale_orders', ['so_number'], {
            name: 'idx_sale_orders_so_number',
        });
        await queryInterface.addIndex('sale_orders', ['customer_id'], {
            name: 'idx_sale_orders_customer_id',
        });
        await queryInterface.addIndex('sale_orders', ['warehouse_id'], {
            name: 'idx_sale_orders_warehouse_id',
        });
        await queryInterface.addIndex('sale_orders', ['status'], {
            name: 'idx_sale_orders_status',
        });
        await queryInterface.addIndex('sale_orders', ['order_date'], {
            name: 'idx_sale_orders_order_date',
        });
        await queryInterface.addIndex('sale_orders', ['payment_status'], {
            name: 'idx_sale_orders_payment_status',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('sale_orders');
    },
};
