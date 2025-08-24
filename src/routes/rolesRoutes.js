import { Router } from 'express';
import RoleController from '../controllers/rolesController.js';
import { body, param } from 'express-validator';
import { authenticateToken, requirePermission } from '../middlewares/auth.js';

const router = Router();

// Validation rules
const createRoleValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
];

const updateRoleValidation = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
];

const assignPermissionsValidation = [
    body('permissionIds')
        .isArray({ min: 1 })
        .withMessage('Permission IDs must be a non-empty array')
        .custom((value) => {
            if (!value.every(id => Number.isInteger(id) && id > 0)) {
                throw new Error('All permission IDs must be positive integers');
            }
            return true;
        })
];

const removePermissionsValidation = [
    body('permissionIds')
        .isArray({ min: 1 })
        .withMessage('Permission IDs must be a non-empty array')
        .custom((value) => {
            if (!value.every(id => Number.isInteger(id) && id > 0)) {
                throw new Error('All permission IDs must be positive integers');
            }
            return true;
        })
];

const idValidation = [
    param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Routes
router.get('/', requirePermission('view_roles'), RoleController.getAllRoles);
router.get('/:id', [...idValidation, requirePermission('view_roles')], RoleController.getRoleById);
router.post('/', [...createRoleValidation, requirePermission('create_roles')], RoleController.createRole);
router.put('/:id', [...idValidation, ...updateRoleValidation, requirePermission('update_roles')], RoleController.updateRole);
router.delete('/:id', [...idValidation, requirePermission('delete_roles')], RoleController.deleteRole);

// Permission management routes
router.post('/:id/permissions', [...idValidation, ...assignPermissionsValidation, requirePermission('manage_role_permissions')], RoleController.assignPermissions);
router.delete('/:id/permissions', [...idValidation, ...removePermissionsValidation, requirePermission('manage_role_permissions')], RoleController.removePermissions);
router.get('/:id/permissions/check/:permission', [...idValidation, requirePermission('view_roles')], RoleController.checkPermission);

export default router;
