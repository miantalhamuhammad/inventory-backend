import express from 'express';
import supplierController from '../controllers/supplierController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Profile routes - using existing authenticateToken middleware
router.get('/profile', authenticateToken, supplierController.getProfile);
router.put('/profile', authenticateToken, supplierController.updateProfile);

// PO Requests routes - add missing endpoints
router.get('/po-requests', authenticateToken, supplierController.getPORequests);
router.get('/po-requests/:id', authenticateToken, supplierController.getPORequestDetail);

// Quotations routes - add missing endpoints
router.get('/quotations', authenticateToken, supplierController.getQuotations);
router.post('/quotations', authenticateToken, supplierController.submitQuotation);
router.get('/quotations/:id', authenticateToken, supplierController.getQuotationDetail);

export default router;
