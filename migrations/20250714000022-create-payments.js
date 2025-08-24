'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            payment_number: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            reference_type: {
                type: Sequelize.ENUM('SALE_ORDER', 'PURCHASE_ORDER', 'INVOICE'),
                allowNull: false,
            },
            reference_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            payment_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false,
            },
            payment_method: {
                type: Sequelize.ENUM('CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'CHECK', 'DIGITAL_WALLET'),
                allowNull: false,
            },
            transaction_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            processed_by: {
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
        await queryInterface.addIndex('payments', ['payment_number'], {
            name: 'idx_payments_payment_number',
        });
        await queryInterface.addIndex('payments', ['reference_type', 'reference_id'], {
            name: 'idx_payments_reference',
        });
        await queryInterface.addIndex('payments', ['payment_date'], {
            name: 'idx_payments_payment_date',
        });
        await queryInterface.addIndex('payments', ['status'], {
            name: 'idx_payments_status',
        });
        await queryInterface.addIndex('payments', ['transaction_id'], {
            name: 'idx_payments_transaction_id',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('payments');
    },
};
