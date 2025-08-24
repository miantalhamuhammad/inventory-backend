'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('employees', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            employee_id: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            full_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
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
            department_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'departments',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            position: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            hire_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            salary: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'TERMINATED'),
                allowNull: false,
                defaultValue: 'ACTIVE',
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
        await queryInterface.addIndex('employees', ['employee_id'], {
            name: 'idx_employees_employee_id',
        });
        await queryInterface.addIndex('employees', ['email'], {
            name: 'idx_employees_email',
        });
        await queryInterface.addIndex('employees', ['department_id'], {
            name: 'idx_employees_department_id',
        });
        await queryInterface.addIndex('employees', ['status'], {
            name: 'idx_employees_status',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('employees');
    },
};
