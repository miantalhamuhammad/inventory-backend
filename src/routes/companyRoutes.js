import express from 'express';
import CompanyController from '../controllers/companyController.js';
import { body } from 'express-validator';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Validation rules for company creation
const createCompanyValidation = [
    body('name')
        .notEmpty()
        .withMessage('Company name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Company name must be between 2 and 255 characters'),
    body('address')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Address must not exceed 1000 characters'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('website')
        .optional()
        .isURL()
        .withMessage('Please provide a valid website URL')
];

// Validation rules for company update
const updateCompanyValidation = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 255 })
        .withMessage('Company name must be between 2 and 255 characters'),
    body('address')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Address must not exceed 1000 characters'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('website')
        .optional()
        .isURL()
        .withMessage('Please provide a valid website URL')
];

// Public route for company registration (no authentication required)
router.post('/', createCompanyValidation, CompanyController.addNewCompany);

// All other company routes require authentication
router.use(authenticateToken);

router.get('/', CompanyController.getAllCompanies);
router.get('/:id', CompanyController.getCompanyById);
router.put('/:id', updateCompanyValidation, CompanyController.updateCompany);
router.delete('/:id', CompanyController.deleteCompany);
router.put('/:id/deactivate', CompanyController.deactivateCompany);
router.put('/:id/activate', CompanyController.activateCompany);

export default router;
