import express from 'express';
import CustomersController from '../controllers/customersController.js';

const router = express.Router();

// Customer routes
router.get('/', CustomersController.getCustomers);
router.get('/search', CustomersController.searchCustomers);
router.get('/export', CustomersController.exportCustomers);
router.get('/:id', CustomersController.getCustomer);
router.get('/:id/orders', CustomersController.getCustomerOrders);
router.get('/:id/invoices', CustomersController.getCustomerInvoices);
router.post('/', CustomersController.createCustomer);
router.put('/:id', CustomersController.updateCustomer);
router.delete('/:id', CustomersController.deleteCustomer);

export default router;
