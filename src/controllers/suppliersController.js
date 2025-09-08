import SupplierService from '../services/supplierService.js';
import { validationResult } from 'express-validator';

class SuppliersController {
    // GET /api/suppliers
    static async getSuppliers(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '', category } = req.query;
            const filters = {
                category,
                company_id: req.companyId // Add company filter
            };

            const result = await SupplierService.findAll(
                parseInt(page),
                parseInt(limit),
                search,
                filters,
            );

            res.success(result, 'Suppliers retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/suppliers/:id
    static async getSupplier(req, res, next) {
        try {
            const { id } = req.params;
            const supplier = await SupplierService.findById(id, req.companyId);

            if (!supplier) {
                return res.error('Supplier not found', 404);
            }

            res.success(supplier, 'Supplier retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/suppliers
    static async createSupplier(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            // Add company_id to supplier data
            const supplierData = {
                ...req.body,
                company_id: req.companyId
            };

            const supplier = await SupplierService.create(supplierData);
            res.success(supplier, 'Supplier created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/suppliers/:id
    static async updateSupplier(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const updated = await SupplierService.update(id, req.body, req.companyId);

            if (!updated) {
                return res.error('Supplier not found or access denied', 404);
            }

            res.success(null, 'Supplier updated successfully');
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/suppliers/:id
    static async deleteSupplier(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await SupplierService.delete(id, req.companyId);

            if (!deleted) {
                return res.error('Supplier not found or access denied', 404);
            }

            res.success(null, 'Supplier deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/suppliers/search
    static async searchSuppliers(req, res, next) {
        try {
            const { q, page = 1, limit = 10 } = req.query;

            if (!q) {
                return res.error('Search query is required', 400);
            }

            const result = await SupplierService.findAll(
                parseInt(page),
                parseInt(limit),
                q,
            );

            res.success(result, 'Suppliers search completed');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/suppliers/export
    static async exportSuppliers(req, res, next) {
        try {
            const result = await SupplierService.findAll(1, 1000);
            res.success(result.data, 'Suppliers exported successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/suppliers/:id/products
    static async getSupplierProducts(req, res, next) {
        try {
            const { id } = req.params;
            const products = await SupplierService.getProducts(id);
            res.success(products, 'Supplier products retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/suppliers/:id/orders
    static async getSupplierOrders(req, res, next) {
        try {
            const { id } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const result = await SupplierService.getOrders(id, parseInt(page), parseInt(limit));
            res.success(result, 'Supplier orders retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/suppliers/with-users - Get suppliers that have users with supplier role
    static async getSuppliersWithUsers(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '', category } = req.query;
            const filters = { category };

            const result = await SupplierService.findSuppliersWithUsers(
                parseInt(page),
                parseInt(limit),
                search,
                filters,
            );

            res.success(result, 'Suppliers with users retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default SuppliersController;
