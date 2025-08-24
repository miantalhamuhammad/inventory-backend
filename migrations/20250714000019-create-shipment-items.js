'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shipment_items', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            shipment_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'shipments',
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
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
        });

        // Add indexes
        await queryInterface.addIndex('shipment_items', ['shipment_id'], {
            name: 'idx_shipment_items_shipment_id',
        });
        await queryInterface.addIndex('shipment_items', ['product_id'], {
            name: 'idx_shipment_items_product_id',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('shipment_items');
    },
};
