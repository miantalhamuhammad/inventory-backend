import express from 'express';
import SupplierRegistrationController from '../controllers/supplierRegistrationController.js';

const router = express.Router();

// Supplier registration route
router.post('/register-supplier', SupplierRegistrationController.registerSupplier);

export default router;
