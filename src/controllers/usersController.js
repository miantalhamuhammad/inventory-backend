import UserService from '../services/userService.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

class UserController {
    // GET /api/users
    static async getAllUsers(req, res, next) {
        try {
            const { page = 1, limit = 10, search, role_id } = req.query;
            const offset = (page - 1) * limit;

            const options = {
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['created_at', 'DESC']],
                where: {
                    company_id: req.companyId // Filter by company
                }
            };

            // Add search functionality
            if (search) {
                options.where = {
                    ...options.where,
                    [Op.or]: [
                        { username: { [Op.iLike]: `%${search}%` } },
                        { email: { [Op.iLike]: `%${search}%` } },
                        { first_name: { [Op.iLike]: `%${search}%` } },
                        { last_name: { [Op.iLike]: `%${search}%` } }
                    ]
                };
            }

            // Filter by role if specified
            if (role_id) {
                options.where = {
                    ...options.where,
                    role_id: role_id
                };
            }

            const users = await UserService.findAll(options);

            res.success(users, 'Users retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/users/:id
    static async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id, req.companyId);

            if (!user) {
                return res.error('User not found or access denied', 404);
            }

            res.success(user, 'User retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/users
    static async createUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            // Add company_id to user data
            const userData = {
                ...req.body,
                company_id: req.companyId
            };

            const user = await UserService.create(userData);
            res.success(user, 'User created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/users/:id
    static async updateUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const updated = await UserService.update(id, req.body, req.companyId);

            if (!updated) {
                return res.error('User not found or access denied', 404);
            }

            res.success(null, 'User updated successfully');
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/users/:id
    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await UserService.delete(id, req.companyId);

            if (!deleted) {
                return res.error('User not found or access denied', 404);
            }

            res.success(null, 'User deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/users/:id/assign-role
    static async assignRole(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const { role_id } = req.body;

            const user = await UserService.assignRole(id, role_id);
            res.success(user, 'Role assigned successfully');
        } catch (error) {
            if (error.message === 'User not found' || error.message === 'Role not found') {
                return res.error(error.message, 404);
            }
            next(error);
        }
    }

    // DELETE /api/users/:id/remove-role
    static async removeRole(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.removeRole(id);

            res.success(user, 'Role removed successfully');
        } catch (error) {
            if (error.message === 'User not found') {
                return res.error('User not found', 404);
            }
            next(error);
        }
    }

    // GET /api/users/by-role/:roleId
    static async getUsersByRole(req, res, next) {
        try {
            const { roleId } = req.params;
            const users = await UserService.findByRoleId(roleId);

            res.success(users, 'Users retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/users/bulk-assign-roles
    static async bulkAssignRoles(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { user_ids, role_id } = req.body;
            const result = await UserService.bulkAssignRoles(user_ids, role_id);

            res.success(result, 'Roles assigned successfully');
        } catch (error) {
            if (error.message === 'Role not found') {
                return res.error('Role not found', 404);
            }
            next(error);
        }
    }
}

export default UserController;
