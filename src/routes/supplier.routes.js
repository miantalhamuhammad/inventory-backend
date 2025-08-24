import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import {
    getSupplierPORequests,
    getSupplierPORequestDetail,
    submitQuotation,
    getSupplierQuotations,
    getSupplierQuotationDetail,
    updateQuotationStatus,
    getSupplierProfile,
    updateSupplierProfile
} from '../controllers/supplierController.js';

const router = express.Router();

// All supplier routes require authentication
router.use(authenticateToken);

// PO Requests endpoints
router.get('/po-requests', getSupplierPORequests);
router.get('/po-requests/:id', getSupplierPORequestDetail);

// Quotations endpoints
router.post('/quotations', submitQuotation);
router.get('/quotations', getSupplierQuotations);
router.get('/quotations/:id', getSupplierQuotationDetail);
router.patch('/quotations/:id/status', updateQuotationStatus);

// Profile endpoints
router.get('/profile', getSupplierProfile);
router.put('/profile', updateSupplierProfile);

export default router;
