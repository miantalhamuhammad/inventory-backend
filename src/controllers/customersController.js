import CustomerService from '../services/customerService.js';
import { validationResult } from 'express-validator';

class CustomersController {
    // GET /api/customers
    static async getCustomers(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '', customer_type: customerType } = req.query;
            const filters = { customer_type: customerType };

            const result = await CustomerService.findAll(
                parseInt(page),
                parseInt(limit),
                search,
                filters,
            );

            // Wrap the data array in a 'customers' property for frontend compatibility
            res.success({
                customers: result.data,
                pagination: result.pagination
            }, 'Customers retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/customers/:id
    static async getCustomer(req, res, next) {
        try {
            const { id } = req.params;
            const customer = await CustomerService.findById(id);

            if (!customer) {
                return res.error('Customer not found', 404);
            }

            res.success(customer, 'Customer retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/customers
    static async createCustomer(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const customer = await CustomerService.create(req.body);
            res.success(customer, 'Customer created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/customers/:id
    static async updateCustomer(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const updated = await CustomerService.update(id, req.body);

            if (!updated) {
                return res.error('Customer not found', 404);
            }

            res.success(null, 'Customer updated successfully');
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/customers/:id
    static async deleteCustomer(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await CustomerService.delete(id);

            if (!deleted) {
                return res.error('Customer not found', 404);
            }

            res.success(null, 'Customer deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/customers/search
    static async searchCustomers(req, res, next) {
        try {
            const { q, page = 1, limit = 10 } = req.query;

            if (!q) {
                return res.error('Search query is required', 400);
            }

            const result = await CustomerService.findAll(
                parseInt(page),
                parseInt(limit),
                q,
            );

            res.success(result, 'Customers search completed');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/customers/export
    static async exportCustomers(req, res, next) {
        try {
            const result = await CustomerService.findAll(1, 1000);
            res.success(result.data, 'Customers exported successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/customers/:id/orders
    static async getCustomerOrders(req, res, next) {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const result = await CustomerService.getOrders(id, parseInt(page), parseInt(limit));
            res.success(result, 'Customer orders retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/customers/:id/invoices
    static async getCustomerInvoices(req, res, next) {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const result = await CustomerService.getInvoices(id, parseInt(page), parseInt(limit));
            res.success(result, 'Customer invoices retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default CustomersController;
