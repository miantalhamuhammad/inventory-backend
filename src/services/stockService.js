import { Stock, StockMovement, Product, Warehouse } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class StockService {
    static async create(stockData) {
        const transaction = await sequelize.transaction();
        try {
            // Create stock entry
            const stock = await Stock.create(stockData, { transaction });

            // Record stock movement
            if (stockData.quantity > 0) {
                await StockMovement.create({
                    product_id: stockData.product_id,
                    warehouse_id: stockData.warehouse_id,
                    quantity: stockData.quantity,
                    movement_type: 'IN',
                    reference_type: 'ADJUSTMENT',
                    notes: 'Initial stock entry',
                    created_by: stockData.created_by
                }, { transaction });
            }

            await transaction.commit();
            return stock.toJSON();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async findAll(page = 1, limit = 10, search = '', filters = {}) {
        try {
            const offset = (page - 1) * limit;
            const whereClause = {};
            const includeClause = [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'product_name', 'sku_code'],
                    where: search ? {
                        [Op.or]: [
                            { product_name: { [Op.like]: `%${search}%` } },
                            { sku_code: { [Op.like]: `%${search}%` } }
                        ]
                    } : undefined
                },
                {
                    model: Warehouse,
                    as: 'warehouse',
                    attributes: ['id', 'warehouse_name']
                }
            ];

            // Apply filters
            if (filters.product_id) {
                whereClause.product_id = filters.product_id;
            }
            if (filters.warehouse_id) {
                whereClause.warehouse_id = filters.warehouse_id;
            }
            // Date range filter
            if (filters.startDate && filters.endDate) {
                whereClause.created_at = { [Op.between]: [filters.startDate + ' 00:00:00', filters.endDate + ' 23:59:59'] };
            } else if (filters.startDate) {
                whereClause.created_at = { [Op.gte]: filters.startDate + ' 00:00:00' };
            } else if (filters.endDate) {
                whereClause.created_at = { [Op.lte]: filters.endDate + ' 23:59:59' };
            }

            const { count, rows } = await Stock.findAndCountAll({
                where: whereClause,
                include: includeClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['created_at', 'DESC']]
            });

            return {
                stock: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            };
        } catch (error) {
            throw new Error(`Error fetching stock: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const stock = await Stock.findByPk(id, {
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'product_name', 'sku_code']
                    },
                    {
                        model: Warehouse,
                        as: 'warehouse',
                        attributes: ['id', 'warehouse_name']
                    }
                ]
            });
            return stock ? stock.toJSON() : null;
        } catch (error) {
            throw new Error(`Error fetching stock: ${error.message}`);
        }
    }

    static async update(id, updateData) {
        const transaction = await sequelize.transaction();
        try {
            const stock = await Stock.findByPk(id);
            if (!stock) {
                return null;
            }

            const oldQuantity = stock.quantity;
            await stock.update(updateData, { transaction });

            // Record stock movement if quantity changed
            const quantityDiff = updateData.quantity - oldQuantity;
            if (quantityDiff !== 0) {
                await StockMovement.create({
                    product_id: stock.product_id,
                    warehouse_id: stock.warehouse_id,
                    quantity: Math.abs(quantityDiff),
                    movement_type: quantityDiff > 0 ? 'IN' : 'OUT',
                    reference_type: 'ADJUSTMENT',
                    notes: 'Stock level adjustment',
                    created_by: updateData.updated_by || 1
                }, { transaction });
            }

            await transaction.commit();
            return stock.toJSON();
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error updating stock: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const stock = await Stock.findByPk(id);
            if (!stock) {
                return false;
            }

            await stock.destroy();
            return true;
        } catch (error) {
            throw new Error(`Error deleting stock: ${error.message}`);
        }
    }

    static async getMovements(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            const whereClause = {};

            // Apply filters
            if (filters.product_id) {
                whereClause.product_id = filters.product_id;
            }
            if (filters.warehouse_id) {
                whereClause.warehouse_id = filters.warehouse_id;
            }
            if (filters.movement_type) {
                whereClause.movement_type = filters.movement_type;
            }

            const { count, rows } = await StockMovement.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'product_name', 'sku_code']
                    },
                    {
                        model: Warehouse,
                        as: 'warehouse',
                        attributes: ['id', 'warehouse_name']
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['created_at', 'DESC']]
            });

            return {
                movements: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            };
        } catch (error) {
            throw new Error(`Error fetching stock movements: ${error.message}`);
        }
    }

    static async createMovement(movementData) {
        const transaction = await sequelize.transaction();
        try {
            // Create stock movement record
            const movement = await StockMovement.create(movementData, { transaction });

            // Update stock quantity based on movement type
            const stock = await Stock.findOne({
                where: {
                    product_id: movementData.product_id,
                    warehouse_id: movementData.warehouse_id
                }
            });

            if (stock) {
                let newQuantity = stock.quantity;
                if (movementData.movement_type === 'IN') {
                    newQuantity += movementData.quantity;
                } else if (movementData.movement_type === 'OUT') {
                    newQuantity -= movementData.quantity;
                }

                await stock.update({ quantity: newQuantity }, { transaction });
            }

            await transaction.commit();
            return movement.toJSON();
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error creating stock movement: ${error.message}`);
        }
    }

    static async getLowStockItems(warehouseId = null) {
        try {
            const whereClause = {
                [Op.or]: [
                    sequelize.where(
                        sequelize.col('Stock.quantity'),
                        Op.lte,
                        sequelize.col('Stock.minimum_stock_level')
                    )
                ]
            };

            if (warehouseId) {
                whereClause.warehouse_id = warehouseId;
            }

            const lowStockItems = await Stock.findAll({
                where: whereClause,
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'product_name', 'sku_code']
                    },
                    {
                        model: Warehouse,
                        as: 'warehouse',
                        attributes: ['id', 'warehouse_name']
                    }
                ],
                order: [['quantity', 'ASC']]
            });

            return lowStockItems;
        } catch (error) {
            throw new Error(`Error fetching low stock items: ${error.message}`);
        }
    }
}

export default StockService;
