import { Role, Permission, RolePermission } from '../models/index.js';

class RoleService {
    // Get all roles with their permissions
    static async findAll(options = {}) {
        return await Role.findAll({
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }
            ],
            ...options
        });
    }

    // Get role by ID with permissions
    static async findById(id) {
        return await Role.findByPk(id, {
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }
            ]
        });
    }

    // Create new role
    static async create(roleData) {
        return await Role.create(roleData);
    }

    // Update role
    static async update(id, roleData) {
        const [updatedRowsCount] = await Role.update(roleData, {
            where: { id }
        });

        if (updatedRowsCount === 0) {
            throw new Error('Role not found');
        }

        return await this.findById(id);
    }

    // Delete role
    static async delete(id) {
        const deletedRowsCount = await Role.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            throw new Error('Role not found');
        }

        return true;
    }

    // Assign permissions to role
    static async assignPermissions(roleId, permissionIds) {
        const role = await Role.findByPk(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        const permissions = await Permission.findAll({
            where: { id: permissionIds }
        });

        if (permissions.length !== permissionIds.length) {
            throw new Error('One or more permissions not found');
        }

        await role.setPermissions(permissions);
        return await this.findById(roleId);
    }

    // Remove permissions from role
    static async removePermissions(roleId, permissionIds) {
        const role = await Role.findByPk(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        await role.removePermissions(permissionIds);
        return await this.findById(roleId);
    }

    // Check if role has specific permission
    static async hasPermission(roleId, permissionName) {
        const role = await Role.findByPk(roleId, {
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    where: { name: permissionName },
                    through: { attributes: [] }
                }
            ]
        });

        return role && role.permissions.length > 0;
    }
}

export default RoleService;
