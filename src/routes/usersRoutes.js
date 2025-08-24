import { Router } from 'express';
import UserController from '../controllers/usersController.js';
import { body, param } from 'express-validator';
import { authenticateToken, requirePermission } from '../middlewares/auth.js';

const router = Router();

// Validation rules
const createUserValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 50 })
        .withMessage('First name must not exceed 50 characters'),
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ max: 50 })
        .withMessage('Last name must not exceed 50 characters'),
    body('role_id')
        .optional()
        .isInt()
        .withMessage('Role ID must be an integer')
];

const updateUserValidation = [
    body('username')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('first_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ max: 50 })
        .withMessage('First name must not exceed 50 characters'),
    body('last_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ max: 50 })
        .withMessage('Last name must not exceed 50 characters'),
    body('role_id')
        .optional()
        .isInt()
        .withMessage('Role ID must be an integer')
];

const assignRoleValidation = [
    body('role_id')
        .notEmpty()
        .withMessage('Role ID is required')
        .isInt()
        .withMessage('Role ID must be an integer')
];

const bulkAssignRolesValidation = [
    body('user_ids')
        .isArray({ min: 1 })
        .withMessage('User IDs must be a non-empty array'),
    body('user_ids.*')
        .isInt()
        .withMessage('Each user ID must be an integer'),
    body('role_id')
        .optional()
        .isInt()
        .withMessage('Role ID must be an integer')
];

const idValidation = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer')
];

const roleIdValidation = [
    param('roleId')
        .isInt()
        .withMessage('Role ID must be an integer')
];

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Routes
// GET /api/users - Get all users with pagination and search
router.get('/',
    requirePermission('view_users'),
    UserController.getAllUsers
);

// GET /api/users/:id - Get user by ID
router.get('/:id',
    [...idValidation, requirePermission('view_users')],
    UserController.getUserById
);

// POST /api/users - Create new user
router.post('/',
    [...createUserValidation, requirePermission('create_users')],
    UserController.createUser
);

// PUT /api/users/:id - Update user
router.put('/:id',
    [...idValidation, ...updateUserValidation, requirePermission('update_users')],
    UserController.updateUser
);

// DELETE /api/users/:id - Delete user
router.delete('/:id',
    [...idValidation, requirePermission('delete_users')],
    UserController.deleteUser
);

// POST /api/users/:id/assign-role - Assign role to user
router.post('/:id/assign-role',
    [...idValidation, ...assignRoleValidation, requirePermission('update_users')],
    UserController.assignRole
);

// DELETE /api/users/:id/remove-role - Remove role from user
router.delete('/:id/remove-role',
    [...idValidation, requirePermission('update_users')],
    UserController.removeRole
);

// GET /api/users/by-role/:roleId - Get users by role
router.get('/by-role/:roleId',
    [...roleIdValidation, requirePermission('view_users')],
    UserController.getUsersByRole
);

// POST /api/users/bulk-assign-roles - Bulk assign roles to users
router.post('/bulk-assign-roles',
    [...bulkAssignRolesValidation, requirePermission('update_users')],
    UserController.bulkAssignRoles
);

export default router;
