'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('role_permissions', {
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'roles',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            permission_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'permissions',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
        });

        // Add indexes
        await queryInterface.addIndex('role_permissions', ['role_id'], {
            name: 'idx_role_permissions_role_id',
        });
        await queryInterface.addIndex('role_permissions', ['permission_id'], {
            name: 'idx_role_permissions_permission_id',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('role_permissions');
    },
};
