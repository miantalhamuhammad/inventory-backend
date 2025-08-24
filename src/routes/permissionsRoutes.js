import { Router } from 'express';
import PermissionController from '../controllers/permissionsController.js';
import { body, param } from 'express-validator';
import { authenticateToken, requirePermission } from '../middlewares/auth.js';

const router = Router();

// Validation rules
const createPermissionValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
];

const updatePermissionValidation = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters')
];

const idValidation = [
    param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

const roleIdValidation = [
    param('roleId').isInt({ min: 1 }).withMessage('Role ID must be a positive integer')
];

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Routes
router.get('/', requirePermission('view_permissions'), PermissionController.getAllPermissions);
router.get('/:id', [...idValidation, requirePermission('view_permissions')], PermissionController.getPermissionById);
router.get('/name/:name', requirePermission('view_permissions'), PermissionController.getPermissionByName);
router.post('/', [...createPermissionValidation, requirePermission('create_permissions')], PermissionController.createPermission);
router.put('/:id', [...idValidation, ...updatePermissionValidation, requirePermission('update_permissions')], PermissionController.updatePermission);
router.delete('/:id', [...idValidation, requirePermission('delete_permissions')], PermissionController.deletePermission);

// Get permissions by role
router.get('/role/:roleId', [...roleIdValidation, requirePermission('view_permissions')], PermissionController.getPermissionsByRole);

export default router;
