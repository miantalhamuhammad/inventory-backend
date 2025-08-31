'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Check if permissions already exist
    const existingPermissions = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM permissions',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingPermissions[0].count > 0) {
      console.log('Permissions already exist, skipping permission insertion');
    } else {
      // Insert default permissions
      const permissions = [
        // Role management permissions
        { name: 'view_roles', description: 'View roles and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_roles', description: 'Create new roles', created_at: new Date(), updated_at: new Date() },
        { name: 'update_roles', description: 'Update existing roles', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_roles', description: 'Delete roles', created_at: new Date(), updated_at: new Date() },
        { name: 'manage_role_permissions', description: 'Assign/remove permissions to/from roles', created_at: new Date(), updated_at: new Date() },

        // Permission management permissions
        { name: 'view_permissions', description: 'View permissions and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_permissions', description: 'Create new permissions', created_at: new Date(), updated_at: new Date() },
        { name: 'update_permissions', description: 'Update existing permissions', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_permissions', description: 'Delete permissions', created_at: new Date(), updated_at: new Date() },

        // User management permissions
        { name: 'view_users', description: 'View users and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_users', description: 'Create new users', created_at: new Date(), updated_at: new Date() },
        { name: 'update_users', description: 'Update existing users', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_users', description: 'Delete users', created_at: new Date(), updated_at: new Date() },

        // Product management permissions
        { name: 'view_products', description: 'View products and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_products', description: 'Create new products', created_at: new Date(), updated_at: new Date() },
        { name: 'update_products', description: 'Update existing products', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_products', description: 'Delete products', created_at: new Date(), updated_at: new Date() },

        // Category management permissions
        { name: 'view_categories', description: 'View categories and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_categories', description: 'Create new categories', created_at: new Date(), updated_at: new Date() },
        { name: 'update_categories', description: 'Update existing categories', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_categories', description: 'Delete categories', created_at: new Date(), updated_at: new Date() },

        // Customer management permissions
        { name: 'view_customers', description: 'View customers and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_customers', description: 'Create new customers', created_at: new Date(), updated_at: new Date() },
        { name: 'update_customers', description: 'Update existing customers', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_customers', description: 'Delete customers', created_at: new Date(), updated_at: new Date() },

        // Supplier management permissions
        { name: 'view_suppliers', description: 'View suppliers and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_suppliers', description: 'Create new suppliers', created_at: new Date(), updated_at: new Date() },
        { name: 'update_suppliers', description: 'Update existing suppliers', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_suppliers', description: 'Delete suppliers', created_at: new Date(), updated_at: new Date() },

        // Warehouse management permissions
        { name: 'view_warehouses', description: 'View warehouses and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_warehouses', description: 'Create new warehouses', created_at: new Date(), updated_at: new Date() },
        { name: 'update_warehouses', description: 'Update existing warehouses', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_warehouses', description: 'Delete warehouses', created_at: new Date(), updated_at: new Date() },

        // Order management permissions
        { name: 'view_orders', description: 'View orders and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_orders', description: 'Create new orders', created_at: new Date(), updated_at: new Date() },
        { name: 'update_orders', description: 'Update existing orders', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_orders', description: 'Delete orders', created_at: new Date(), updated_at: new Date() },

        // Stock management permissions
        { name: 'view_stock', description: 'View stock levels and movements', created_at: new Date(), updated_at: new Date() },
        { name: 'manage_stock', description: 'Manage stock levels and movements', created_at: new Date(), updated_at: new Date() },

        // Dashboard permissions
        { name: 'view_dashboard', description: 'View dashboard and analytics', created_at: new Date(), updated_at: new Date() },

        // Employee management permissions
        { name: 'view_employees', description: 'View employees and their details', created_at: new Date(), updated_at: new Date() },
        { name: 'create_employees', description: 'Create new employees', created_at: new Date(), updated_at: new Date() },
        { name: 'update_employees', description: 'Update existing employees', created_at: new Date(), updated_at: new Date() },
        { name: 'delete_employees', description: 'Delete employees', created_at: new Date(), updated_at: new Date() },
      ];

      await queryInterface.bulkInsert('permissions', permissions);
    }

    // Check if roles already exist
    const existingRoles = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM roles',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingRoles[0].count > 0) {
      console.log('Roles already exist, skipping role insertion');
    } else {
      // Insert default roles
      const roles = [
        { name: 'Super Admin', description: 'Full system access with all permissions', created_at: new Date(), updated_at: new Date() },
        { name: 'Admin', description: 'Administrative access with most permissions', created_at: new Date(), updated_at: new Date() },
        { name: 'Manager', description: 'Management level access for operations', created_at: new Date(), updated_at: new Date() },
        { name: 'Employee', description: 'Basic employee access', created_at: new Date(), updated_at: new Date() },
        { name: 'Viewer', description: 'Read-only access to most resources', created_at: new Date(), updated_at: new Date() },
      ];

      await queryInterface.bulkInsert('roles', roles);
    }

    // Check if role-permission relationships already exist
    const existingRolePermissions = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM role_permissions',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingRolePermissions[0].count > 0) {
      console.log('Role-permission relationships already exist, skipping assignment');
    } else {
      // Get role and permission IDs for creating role-permission relationships
      const [rolesResult] = await queryInterface.sequelize.query('SELECT id, name FROM roles');
      const [permissionsResult] = await queryInterface.sequelize.query('SELECT id, name FROM permissions');

      const roleMap = rolesResult.reduce((acc, role) => {
        acc[role.name] = role.id;
        return acc;
      }, {});

      const permissionMap = permissionsResult.reduce((acc, permission) => {
        acc[permission.name] = permission.id;
        return acc;
      }, {});

      // Super Admin gets all permissions
      const superAdminPermissions = Object.values(permissionMap).map(permissionId => ({
        role_id: roleMap['Super Admin'],
        permission_id: permissionId,
      }));

      // Admin gets most permissions (excluding role/permission management)
      const adminPermissions = Object.entries(permissionMap)
        .filter(([name]) => !['create_roles', 'delete_roles', 'create_permissions', 'delete_permissions', 'manage_role_permissions'].includes(name))
        .map(([, id]) => ({
          role_id: roleMap['Admin'],
          permission_id: id,
        }));

      // Manager gets operational permissions
      const managerPermissions = [
        'view_dashboard', 'view_products', 'create_products', 'update_products',
        'view_categories', 'create_categories', 'update_categories',
        'view_customers', 'create_customers', 'update_customers',
        'view_suppliers', 'create_suppliers', 'update_suppliers',
        'view_warehouses', 'view_orders', 'create_orders', 'update_orders',
        'view_stock', 'manage_stock', 'view_employees'
      ].filter(permissionName => permissionMap[permissionName])
       .map(permissionName => ({
        role_id: roleMap['Manager'],
        permission_id: permissionMap[permissionName],
      }));

      // Employee gets basic operational permissions
      const employeePermissions = [
        'view_dashboard', 'view_products', 'view_categories',
        'view_customers', 'view_suppliers', 'view_warehouses',
        'view_orders', 'view_stock'
      ].filter(permissionName => permissionMap[permissionName])
       .map(permissionName => ({
        role_id: roleMap['Employee'],
        permission_id: permissionMap[permissionName],
      }));

      // Viewer gets only view permissions
      const viewerPermissions = Object.entries(permissionMap)
        .filter(([name]) => name.startsWith('view_'))
        .map(([, id]) => ({
          role_id: roleMap['Viewer'],
          permission_id: id,
        }));

      // Insert role-permission relationships
      const allRolePermissions = [
        ...superAdminPermissions,
        ...adminPermissions,
        ...managerPermissions,
        ...employeePermissions,
        ...viewerPermissions,
      ].filter(rp => rp.role_id && rp.permission_id); // Filter out any undefined mappings

      if (allRolePermissions.length > 0) {
        await queryInterface.bulkInsert('role_permissions', allRolePermissions);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
