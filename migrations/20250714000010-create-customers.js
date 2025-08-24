'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('customers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            customer_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            customer_id: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: true,
                unique: true,
            },
            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            city: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            state: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            zip_code: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            country: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            tax_id: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            credit_limit: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            payment_terms: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            customer_type: {
                type: Sequelize.ENUM('INDIVIDUAL', 'BUSINESS'),
                allowNull: false,
                defaultValue: 'INDIVIDUAL',
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
        await queryInterface.addIndex('customers', ['customer_id'], {
            name: 'idx_customers_customer_id',
        });
        await queryInterface.addIndex('customers', ['email'], {
            name: 'idx_customers_email',
        });
        await queryInterface.addIndex('customers', ['customer_name'], {
            name: 'idx_customers_name',
        });
        await queryInterface.addIndex('customers', ['customer_type'], {
            name: 'idx_customers_type',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('customers');
    },
};
