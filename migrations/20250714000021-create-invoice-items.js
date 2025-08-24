'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('invoice_items', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            invoice_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'invoices',
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
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
        });

        // Add indexes
        await queryInterface.addIndex('invoice_items', ['invoice_id'], {
            name: 'idx_invoice_items_invoice_id',
        });
        await queryInterface.addIndex('invoice_items', ['product_id'], {
            name: 'idx_invoice_items_product_id',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('invoice_items');
    },
};
