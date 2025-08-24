import express from 'express';
import StockController from '../controllers/stockController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Validation rules for stock creation
const stockValidationRules = [
    body('product_id').isInt({ min: 1 }).withMessage('Product ID is required and must be a valid integer'),
    body('warehouse_id').isInt({ min: 1 }).withMessage('Warehouse ID is required and must be a valid integer'),
    body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a non-negative number'),
    body('unit_price').optional().isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
    body('minimum_stock_level').optional().isFloat({ min: 0 }).withMessage('Minimum stock level must be a non-negative number'),
    body('maximum_stock_level').optional().isFloat({ min: 0 }).withMessage('Maximum stock level must be a non-negative number'),
    body('batch_number').optional().isString().trim(),
    body('stock_condition').optional().isIn(['NEW','USED','DAMAGED', 'EXPIRED']).withMessage('Stock condition must be NEW, USED, DAMAGED, or EXPIRED'),
    body('expiry_date').optional().isISO8601().withMessage('Expiry date must be a valid date'),
    body('notes').optional().isString().trim(),
];

// Validation rules for stock movement
const movementValidationRules = [
    body('product_id').isInt({ min: 1 }).withMessage('Product ID is required and must be a valid integer'),
    body('warehouse_id').isInt({ min: 1 }).withMessage('Warehouse ID is required and must be a valid integer'),
    body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
    body('movement_type').isIn(['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT']).withMessage('Movement type must be IN, OUT, TRANSFER, or ADJUSTMENT'),
    body('reference_type').optional().isString().trim(),
    body('reference_id').optional().isInt({ min: 1 }),
    body('notes').optional().isString().trim(),
];

// Stock routes
router.get('/', StockController.getAllStock);
router.get('/movements', StockController.getStockMovements);
router.get('/low-stock', StockController.getLowStockItems);
router.get('/:id', StockController.getStock);
router.post('/', stockValidationRules, StockController.createStock);
router.post('/movements', movementValidationRules, StockController.createStockMovement);
router.put('/:id', stockValidationRules, StockController.updateStock);
router.delete('/:id', StockController.deleteStock);

export default router;
