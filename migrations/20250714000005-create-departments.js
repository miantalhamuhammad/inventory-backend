'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('departments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            department_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            department_code: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            manager_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                // Remove foreign key reference for now - will add it later
                // references: {
                //     model: 'employees',
                //     key: 'id',
                // },
                // onUpdate: 'CASCADE',
                // onDelete: 'SET NULL',
            },
            budget: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: true,
            },
            location: {
                type: Sequelize.STRING(255),
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
        await queryInterface.addIndex('departments', ['department_code'], {
            name: 'idx_departments_code',
        });
        await queryInterface.addIndex('departments', ['department_name'], {
            name: 'idx_departments_name',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('departments');
    },
};
