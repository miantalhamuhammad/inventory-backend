import PermissionService from '../services/permissionService.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

class PermissionController {
    // GET /api/permissions
    static async getAllPermissions(req, res, next) {
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

            const permissions = await PermissionService.findAll(options);

            res.success(permissions, 'Permissions retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/permissions/:id
    static async getPermissionById(req, res, next) {
        try {
            const { id } = req.params;
            const permission = await PermissionService.findById(id);

            if (!permission) {
                return res.error('Permission not found', 404);
            }

            res.success(permission, 'Permission retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/permissions/name/:name
    static async getPermissionByName(req, res, next) {
        try {
            const { name } = req.params;
            const permission = await PermissionService.findByName(name);

            if (!permission) {
                return res.error('Permission not found', 404);
            }

            res.success(permission, 'Permission retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/permissions
    static async createPermission(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const permission = await PermissionService.create(req.body);
            res.success(permission, 'Permission created successfully', 201);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.error('Permission name already exists', 400);
            }
            next(error);
        }
    }

    // PUT /api/permissions/:id
    static async updatePermission(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const permission = await PermissionService.update(id, req.body);

            res.success(permission, 'Permission updated successfully');
        } catch (error) {
            if (error.message === 'Permission not found') {
                return res.error('Permission not found', 404);
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.error('Permission name already exists', 400);
            }
            next(error);
        }
    }

    // DELETE /api/permissions/:id
    static async deletePermission(req, res, next) {
        try {
            const { id } = req.params;
            await PermissionService.delete(id);

            res.success(null, 'Permission deleted successfully');
        } catch (error) {
            if (error.message === 'Permission not found') {
                return res.error('Permission not found', 404);
            }
            next(error);
        }
    }

    // GET /api/permissions/role/:roleId
    static async getPermissionsByRole(req, res, next) {
        try {
            const { roleId } = req.params;
            const permissions = await PermissionService.getByRoleId(roleId);

            res.success(permissions, 'Role permissions retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default PermissionController;
