import WarehouseService from '../services/warehouseService.js';
import { validationResult } from 'express-validator';

class WarehousesController {
    // GET /api/warehouses
    static async getWarehouses(req, res, next) {
        try {
            const warehouses = await WarehouseService.findAll();
            res.success(warehouses, 'Warehouses retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/warehouses/:id
    static async getWarehouse(req, res, next) {
        try {
            const { id } = req.params;
            const warehouse = await WarehouseService.findById(id);

            if (!warehouse) {
                return res.error('Warehouse not found', 404);
            }

            res.success(warehouse, 'Warehouse retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/warehouses
    static async createWarehouse(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const warehouse = await WarehouseService.create(req.body);
            res.success(warehouse, 'Warehouse created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/warehouses/:id
    static async updateWarehouse(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const updated = await WarehouseService.update(id, req.body);

            if (!updated) {
                return res.error('Warehouse not found', 404);
            }

            res.success(null, 'Warehouse updated successfully');
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/warehouses/:id
    static async deleteWarehouse(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await WarehouseService.delete(id);

            if (!deleted) {
                return res.error('Warehouse not found', 404);
            }

            res.success(null, 'Warehouse deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/warehouses/:id/stock
    static async getWarehouseStock(req, res, next) {
        try {
            const { id } = req.params;
            const stock = await WarehouseService.getStock(id);
            res.success(stock, 'Warehouse stock retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/warehouses/:id/capacity
    static async getWarehouseCapacity(req, res, next) {
        try {
            const { id } = req.params;
            const capacity = await WarehouseService.getCapacity(id);
            res.success(capacity, 'Warehouse capacity retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default WarehousesController;
