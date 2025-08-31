'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        // Check if roles already exist
        const existingRoles = await queryInterface.sequelize.query(
            'SELECT COUNT(*) as count FROM roles',
            { type: Sequelize.QueryTypes.SELECT }
        );

        if (existingRoles[0].count > 0) {
            console.log('Roles already exist, skipping role insertion');
        } else {
            // Insert default roles only if none exist
            await queryInterface.bulkInsert('roles', [
                {
                    name: 'Super Admin',
                    description: 'System Administrator with full access',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Admin',
                    description: 'Administrator with most permissions',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Manager',
                    description: 'Manager with operational access',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'Employee',
                    description: 'Basic employee access',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ]);
        }

        // Check if permissions already exist
        const existingPermissions = await queryInterface.sequelize.query(
            'SELECT COUNT(*) as count FROM permissions',
            { type: Sequelize.QueryTypes.SELECT }
        );

        if (existingPermissions[0].count > 0) {
            console.log('Permissions already exist, skipping permission insertion');
        } else {
            // Insert basic permissions only if none exist
            await queryInterface.bulkInsert('permissions', [
                { name: 'view_roles', description: 'View roles and their details', created_at: new Date(), updated_at: new Date() },
                { name: 'create_roles', description: 'Create new roles', created_at: new Date(), updated_at: new Date() },
                { name: 'update_roles', description: 'Update existing roles', created_at: new Date(), updated_at: new Date() },
                { name: 'delete_roles', description: 'Delete roles', created_at: new Date(), updated_at: new Date() },
                { name: 'view_permissions', description: 'View permissions', created_at: new Date(), updated_at: new Date() },
                { name: 'create_permissions', description: 'Create permissions', created_at: new Date(), updated_at: new Date() },
                { name: 'view_products', description: 'View products', created_at: new Date(), updated_at: new Date() },
                { name: 'create_products', description: 'Create products', created_at: new Date(), updated_at: new Date() },
                { name: 'view_dashboard', description: 'View dashboard', created_at: new Date(), updated_at: new Date() },
                { name: 'view_users', description: 'View users and their details', created_at: new Date(), updated_at: new Date() },
                { name: 'create_users', description: 'Create new users', created_at: new Date(), updated_at: new Date() },
                { name: 'update_users', description: 'Update existing users', created_at: new Date(), updated_at: new Date() },
                { name: 'delete_users', description: 'Delete users', created_at: new Date(), updated_at: new Date() },
            ]);
        }

        // Check if role-permission assignments already exist
        const existingRolePermissions = await queryInterface.sequelize.query(
            'SELECT COUNT(*) as count FROM role_permissions',
            { type: Sequelize.QueryTypes.SELECT }
        );

        if (existingRolePermissions[0].count > 0) {
            console.log('Role-permission assignments already exist, skipping assignment');
        } else {
            // Get the actual role and permission IDs from the database
            const roles = await queryInterface.sequelize.query(
                'SELECT id, name FROM roles',
                { type: Sequelize.QueryTypes.SELECT }
            );
            const permissions = await queryInterface.sequelize.query(
                'SELECT id, name FROM permissions',
                { type: Sequelize.QueryTypes.SELECT }
            );

            const roleMap = roles.reduce((acc, role) => {
                acc[role.name] = role.id;
                return acc;
            }, {});

            const permissionMap = permissions.reduce((acc, permission) => {
                acc[permission.name] = permission.id;
                return acc;
            }, {});

            // Assign permissions to roles using actual IDs
            const rolePermissions = [];

            // Super Admin gets all permissions
            if (roleMap['Super Admin']) {
                permissions.forEach(permission => {
                    rolePermissions.push({ role_id: roleMap['Super Admin'], permission_id: permission.id });
                });
            }

            // Admin gets most permissions
            if (roleMap['Admin']) {
                const adminPermissionNames = ['view_roles', 'view_permissions', 'view_products', 'create_products', 'view_dashboard', 'view_users', 'create_users', 'update_users', 'delete_users'];
                adminPermissionNames.forEach(permName => {
                    if (permissionMap[permName]) {
                        rolePermissions.push({ role_id: roleMap['Admin'], permission_id: permissionMap[permName] });
                    }
                });
            }

            // Manager gets operational permissions
            if (roleMap['Manager']) {
                const managerPermissionNames = ['view_products', 'create_products', 'view_dashboard', 'view_users'];
                managerPermissionNames.forEach(permName => {
                    if (permissionMap[permName]) {
                        rolePermissions.push({ role_id: roleMap['Manager'], permission_id: permissionMap[permName] });
                    }
                });
            }

            // Employee gets basic permissions
            if (roleMap['Employee']) {
                const employeePermissionNames = ['view_products', 'view_dashboard'];
                employeePermissionNames.forEach(permName => {
                    if (permissionMap[permName]) {
                        rolePermissions.push({ role_id: roleMap['Employee'], permission_id: permissionMap[permName] });
                    }
                });
            }

            if (rolePermissions.length > 0) {
                await queryInterface.bulkInsert('role_permissions', rolePermissions);
            }
        }
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.bulkDelete('role_permissions', null, {});
        await queryInterface.bulkDelete('permissions', null, {});
        await queryInterface.bulkDelete('roles', null, {});
    },
};
