import RoleService from '../services/roleService.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

class RoleController {
    // GET /api/roles
    static async getAllRoles(req, res, next) {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const offset = (page - 1) * limit;

            const options = {
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['name', 'ASC']]
            };

            if (search) {
                options.where = {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${search}%` } },
                        { description: { [Op.iLike]: `%${search}%` } }
                    ]
                };
            }

            const roles = await RoleService.findAll(options);

            res.success(roles, 'Roles retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/roles/:id
    static async getRoleById(req, res, next) {
        try {
            const { id } = req.params;
            const role = await RoleService.findById(id);

            if (!role) {
                return res.error('Role not found', 404);
            }

            res.success(role, 'Role retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/roles
    static async createRole(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const role = await RoleService.create(req.body);
            res.success(role, 'Role created successfully', 201);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.error('Role name already exists', 400);
            }
            next(error);
        }
    }

    // PUT /api/roles/:id
    static async updateRole(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const role = await RoleService.update(id, req.body);

            res.success(role, 'Role updated successfully');
        } catch (error) {
            if (error.message === 'Role not found') {
                return res.error('Role not found', 404);
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.error('Role name already exists', 400);
            }
            next(error);
        }
    }

    // DELETE /api/roles/:id
    static async deleteRole(req, res, next) {
        try {
            const { id } = req.params;
            await RoleService.delete(id);

            res.success(null, 'Role deleted successfully');
        } catch (error) {
            if (error.message === 'Role not found') {
                return res.error('Role not found', 404);
            }
            next(error);
        }
    }

    // POST /api/roles/:id/permissions
    static async assignPermissions(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const { permissionIds } = req.body;

            const role = await RoleService.assignPermissions(id, permissionIds);
            res.success(role, 'Permissions assigned successfully');
        } catch (error) {
            if (error.message === 'Role not found') {
                return res.error('Role not found', 404);
            }
            if (error.message === 'One or more permissions not found') {
                return res.error('One or more permissions not found', 400);
            }
            next(error);
        }
    }

    // DELETE /api/roles/:id/permissions
    static async removePermissions(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const { permissionIds } = req.body;

            const role = await RoleService.removePermissions(id, permissionIds);
            res.success(role, 'Permissions removed successfully');
        } catch (error) {
            if (error.message === 'Role not found') {
                return res.error('Role not found', 404);
            }
            next(error);
        }
    }

    // GET /api/roles/:id/permissions/check/:permission
    static async checkPermission(req, res, next) {
        try {
            const { id, permission } = req.params;
            const hasPermission = await RoleService.hasPermission(id, permission);

            res.success({ hasPermission }, 'Permission check completed');
        } catch (error) {
            next(error);
        }
    }
}

export default RoleController;
