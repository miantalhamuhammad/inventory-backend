import StockService from '../services/stockService.js';
import { validationResult } from 'express-validator';

class StockController {
    // GET /api/stock
    static async getAllStock(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '', product_id: productId, warehouse_id: warehouseId, startDate, endDate } = req.query;
            const filters = {
                product_id: productId,
                warehouse_id: warehouseId,
                company_id: req.companyId // Add company filter
            };
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const result = await StockService.findAll(
                parseInt(page),
                parseInt(limit),
                search,
                filters,
            );

            res.success(result, 'Stock retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/stock/:id
    static async getStock(req, res, next) {
        try {
            const { id } = req.params;
            const stock = await StockService.findById(id, req.companyId);

            if (!stock) {
                return res.error('Stock entry not found', 404);
            }

            res.success(stock, 'Stock retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/stock
    static async createStock(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            // Add company_id to stock data
            const stockData = {
                ...req.body,
                company_id: req.companyId
            };

            const stock = await StockService.create(stockData);
            res.success(stock, 'Stock created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/stock/:id
    static async updateStock(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const stock = await StockService.update(id, req.body, req.companyId);

            if (!stock) {
                return res.error('Stock entry not found or access denied', 404);
            }

            res.success(stock, 'Stock updated successfully');
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/stock/:id
    static async deleteStock(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await StockService.delete(id, req.companyId);

            if (!deleted) {
                return res.error('Stock entry not found or access denied', 404);
            }

            res.success(null, 'Stock deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/stock/movements
    static async getStockMovements(req, res, next) {
        try {
            const { page = 1, limit = 10, product_id: productId, warehouse_id: warehouseId, movement_type: movementType } = req.query;
            const filters = { product_id: productId, warehouse_id: warehouseId, movement_type: movementType };

            const result = await StockService.getMovements(
                parseInt(page),
                parseInt(limit),
                filters,
            );

            res.success(result, 'Stock movements retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/stock/movements
    static async createStockMovement(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const movement = await StockService.createMovement(req.body);
            res.success(movement, 'Stock movement created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/stock/low-stock
    static async getLowStockItems(req, res, next) {
        try {
            const { warehouse_id: warehouseId } = req.query;
            const lowStockItems = await StockService.getLowStockItems(warehouseId);

            res.success(lowStockItems, 'Low stock items retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default StockController;
