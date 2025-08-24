import { User, Role, Permission } from '../models/index.js';

class UserService {
    // Get all users with their roles and permissions
    static async findAll(options = {}) {
        return await User.findAll({
            include: [
                {
                    model: Role,
                    as: 'role',
                    include: [
                        {
                            model: Permission,
                            as: 'permissions',
                            through: { attributes: [] }
                        }
                    ]
                }
            ],
            ...options
        });
    }

    // Get user by ID with role and permissions
    static async findById(id) {
        return await User.findByPk(id, {
            include: [
                {
                    model: Role,
                    as: 'role',
                    include: [
                        {
                            model: Permission,
                            as: 'permissions',
                            through: { attributes: [] }
                        }
                    ]
                }
            ]
        });
    }

    // Get user by email
    static async findByEmail(email) {
        return await User.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    as: 'role',
                    include: [
                        {
                            model: Permission,
                            as: 'permissions',
                            through: { attributes: [] }
                        }
                    ]
                }
            ]
        });
    }

    // Create new user
    static async create(userData) {
        return await User.create(userData);
    }

    // Update user
    static async update(id, userData) {
        const [updatedRowsCount] = await User.update(userData, {
            where: { id }
        });

        if (updatedRowsCount === 0) {
            throw new Error('User not found');
        }

        return await this.findById(id);
    }

    // Delete user
    static async delete(id) {
        const deletedRowsCount = await User.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            throw new Error('User not found');
        }

        return true;
    }

    // Assign role to user
    static async assignRole(userId, roleId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (roleId) {
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error('Role not found');
            }
        }

        await user.update({ role_id: roleId });
        return await this.findById(userId);
    }

    // Remove role from user
    static async removeRole(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await user.update({ role_id: null });
        return await this.findById(userId);
    }

    // Get users by role
    static async findByRoleId(roleId) {
        return await User.findAll({
            where: { role_id: roleId },
            include: [
                {
                    model: Role,
                    as: 'role',
                    include: [
                        {
                            model: Permission,
                            as: 'permissions',
                            through: { attributes: [] }
                        }
                    ]
                }
            ]
        });
    }

    // Bulk assign roles
    static async bulkAssignRoles(userIds, roleId) {
        if (roleId) {
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error('Role not found');
            }
        }

        const [updatedRowsCount] = await User.update(
            { role_id: roleId },
            { where: { id: userIds } }
        );

        return {
            updatedCount: updatedRowsCount,
            userIds
        };
    }
}

export default UserService;
