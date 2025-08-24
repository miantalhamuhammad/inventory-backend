'use strict';

/** @type {import('sequelize-cli').Migration} */
const rolePermissionSeeder = {
    async up(queryInterface, _Sequelize) {
        // Insert default roles
        await queryInterface.bulkInsert('roles', [
            {
                id: 1,
                name: 'Super Admin',
                description: 'System Administrator with full access',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                name: 'Admin',
                description: 'Administrator with most permissions',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                name: 'Manager',
                description: 'Manager with operational access',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                name: 'Employee',
                description: 'Basic employee access',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        // Insert basic permissions
        await queryInterface.bulkInsert('permissions', [
            { id: 1, name: 'view_roles', description: 'View roles and their details', created_at: new Date(), updated_at: new Date() },
            { id: 2, name: 'create_roles', description: 'Create new roles', created_at: new Date(), updated_at: new Date() },
            { id: 3, name: 'update_roles', description: 'Update existing roles', created_at: new Date(), updated_at: new Date() },
            { id: 4, name: 'delete_roles', description: 'Delete roles', created_at: new Date(), updated_at: new Date() },
            { id: 5, name: 'view_permissions', description: 'View permissions', created_at: new Date(), updated_at: new Date() },
            { id: 6, name: 'create_permissions', description: 'Create permissions', created_at: new Date(), updated_at: new Date() },
            { id: 7, name: 'view_products', description: 'View products', created_at: new Date(), updated_at: new Date() },
            { id: 8, name: 'create_products', description: 'Create products', created_at: new Date(), updated_at: new Date() },
            { id: 9, name: 'view_dashboard', description: 'View dashboard', created_at: new Date(), updated_at: new Date() },
            { id: 10, name: 'view_users', description: 'View users and their details', created_at: new Date(), updated_at: new Date() },
            { id: 11, name: 'create_users', description: 'Create new users', created_at: new Date(), updated_at: new Date() },
            { id: 12, name: 'update_users', description: 'Update existing users', created_at: new Date(), updated_at: new Date() },
            { id: 13, name: 'delete_users', description: 'Delete users', created_at: new Date(), updated_at: new Date() },
        ]);

        // Assign permissions to roles
        await queryInterface.bulkInsert('role_permissions', [
            // Super Admin gets all permissions
            { role_id: 1, permission_id: 1 },
            { role_id: 1, permission_id: 2 },
            { role_id: 1, permission_id: 3 },
            { role_id: 1, permission_id: 4 },
            { role_id: 1, permission_id: 5 },
            { role_id: 1, permission_id: 6 },
            { role_id: 1, permission_id: 7 },
            { role_id: 1, permission_id: 8 },
            { role_id: 1, permission_id: 9 },
            { role_id: 1, permission_id: 10 },
            { role_id: 1, permission_id: 11 },
            { role_id: 1, permission_id: 12 },
            { role_id: 1, permission_id: 13 },

            // Admin gets most permissions
            { role_id: 2, permission_id: 1 },
            { role_id: 2, permission_id: 5 },
            { role_id: 2, permission_id: 7 },
            { role_id: 2, permission_id: 8 },
            { role_id: 2, permission_id: 9 },
            { role_id: 2, permission_id: 10 },
            { role_id: 2, permission_id: 11 },
            { role_id: 2, permission_id: 12 },
            { role_id: 2, permission_id: 13 },

            // Manager gets operational permissions
            { role_id: 3, permission_id: 7 },
            { role_id: 3, permission_id: 8 },
            { role_id: 3, permission_id: 9 },
            { role_id: 3, permission_id: 10 }, // view_users

            // Employee gets basic permissions
            { role_id: 4, permission_id: 7 },
            { role_id: 4, permission_id: 9 },
        ]);
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.bulkDelete('role_permissions', null, {});
        await queryInterface.bulkDelete('permissions', null, {});
        await queryInterface.bulkDelete('roles', null, {});
    },
};

module.exports = rolePermissionSeeder;
