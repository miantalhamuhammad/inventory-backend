'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('suppliers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            supplier_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            supplier_id: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            contact_person: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: true,
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
            payment_terms: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            category: {
                type: Sequelize.STRING(100),
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
        await queryInterface.addIndex('suppliers', ['supplier_id'], {
            name: 'idx_suppliers_supplier_id',
        });
        await queryInterface.addIndex('suppliers', ['email'], {
            name: 'idx_suppliers_email',
        });
        await queryInterface.addIndex('suppliers', ['supplier_name'], {
            name: 'idx_suppliers_name',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('suppliers');
    },
};
