'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('invoices', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            invoice_number: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            sale_order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'sale_orders',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
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
            invoice_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            due_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
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
            },
            paid_amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            balance: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'DRAFT',
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
        await queryInterface.addIndex('invoices', ['invoice_number'], {
            name: 'idx_invoices_invoice_number',
        });
        await queryInterface.addIndex('invoices', ['sale_order_id'], {
            name: 'idx_invoices_sale_order_id',
        });
        await queryInterface.addIndex('invoices', ['customer_id'], {
            name: 'idx_invoices_customer_id',
        });
        await queryInterface.addIndex('invoices', ['status'], {
            name: 'idx_invoices_status',
        });
        await queryInterface.addIndex('invoices', ['due_date'], {
            name: 'idx_invoices_due_date',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('invoices');
    },
};
