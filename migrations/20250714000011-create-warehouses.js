'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('warehouses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            warehouse_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            warehouse_id: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            location: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            manager_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'employees',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            contact_number: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            description: {
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
        await queryInterface.addIndex('warehouses', ['warehouse_id'], {
            name: 'idx_warehouses_warehouse_id',
        });
        await queryInterface.addIndex('warehouses', ['manager_id'], {
            name: 'idx_warehouses_manager_id',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('warehouses');
    },
};
