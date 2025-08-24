import { Permission, Role } from '../models/index.js';

class PermissionService {
    // Get all permissions
    static async findAll(options = {}) {
        return await Permission.findAll({
            include: [
                {
                    model: Role,
                    as: 'roles',
                    through: { attributes: [] }
                }
            ],
            ...options
        });
    }

    // Get permission by ID
    static async findById(id) {
        return await Permission.findByPk(id, {
            include: [
                {
                    model: Role,
                    as: 'roles',
                    through: { attributes: [] }
                }
            ]
        });
    }

    // Get permission by name
    static async findByName(name) {
        return await Permission.findOne({
            where: { name },
            include: [
                {
                    model: Role,
                    as: 'roles',
                    through: { attributes: [] }
                }
            ]
        });
    }

    // Create new permission
    static async create(permissionData) {
        return await Permission.create(permissionData);
    }

    // Update permission
    static async update(id, permissionData) {
        const [updatedRowsCount] = await Permission.update(permissionData, {
            where: { id }
        });

        if (updatedRowsCount === 0) {
            throw new Error('Permission not found');
        }

        return await this.findById(id);
    }

    // Delete permission
    static async delete(id) {
        const deletedRowsCount = await Permission.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            throw new Error('Permission not found');
        }

        return true;
    }

    // Get permissions by role ID
    static async getByRoleId(roleId) {
        const role = await Role.findByPk(roleId, {
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }
            ]
        });

        return role ? role.permissions : [];
    }
}

export default PermissionService;
