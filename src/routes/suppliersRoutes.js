import express from 'express';
import SuppliersController from '../controllers/suppliersController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Supplier routes
router.get('/with-users', authenticateToken, SuppliersController.getSuppliersWithUsers);
router.get('/search', authenticateToken, SuppliersController.searchSuppliers);
router.get('/export', authenticateToken, SuppliersController.exportSuppliers);
router.get('/', authenticateToken, SuppliersController.getSuppliers);
router.get('/:id', authenticateToken, SuppliersController.getSupplier);
router.get('/:id/products', authenticateToken, SuppliersController.getSupplierProducts);
router.get('/:id/orders', authenticateToken, SuppliersController.getSupplierOrders);
router.post('/', authenticateToken, SuppliersController.createSupplier);
router.put('/:id', authenticateToken, SuppliersController.updateSupplier);
router.delete('/:id', authenticateToken, SuppliersController.deleteSupplier);

export default router;
