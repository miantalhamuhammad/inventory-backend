import { Product, SaleOrder, Supplier, Customer, Warehouse, Stock, SaleOrderItem, PurchaseOrder, StockMovement, User } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

class DashboardService {
    static async getStats() {
        try {
            const [productCount, orderCount, supplierCount, customerCount, warehouseCount, totalRevenue] = await Promise.all([
                Product.count(),
                SaleOrder.count({
                    where: {
                        created_at: {
                            [Op.gte]: literal('DATE_SUB(NOW(), INTERVAL 30 DAY)')
                        }
                    }
                }),
                Supplier.count(),
                Customer.count(),
                Warehouse.count(),
                SaleOrder.sum('total_amount', {
                    where: {
                        status: 'DELIVERED',
                        created_at: {
                            [Op.gte]: literal('DATE_SUB(NOW(), INTERVAL 30 DAY)')
                        }
                    }
                })
            ]);

            return {
                totalProducts: productCount,
                totalOrders: orderCount,
                totalSuppliers: supplierCount,
                totalCustomers: customerCount,
                totalWarehouses: warehouseCount,
                monthlyRevenue: totalRevenue || 0,
            };
        } catch (error) {
            throw new Error(`Error fetching dashboard stats: ${error.message}`);
        }
    }

    static async getRecentOrders(limit = 10) {
        try {
            const [saleOrders, purchaseOrders] = await Promise.all([
                SaleOrder.findAll({
                    include: [
                        {
                            model: Customer,
                            as: 'customer',
                            attributes: ['id', 'customer_name']
                        }
                    ],
                    order: [['created_at', 'DESC']],
                    limit
                }),
                PurchaseOrder.findAll({
                    include: [
                        {
                            model: Supplier,
                            as: 'supplier',
                            attributes: ['id', 'supplier_name']
                        }
                    ],
                    order: [['created_at', 'DESC']],
                    limit
                })
            ]);

            return {
                saleOrders: saleOrders.map(order => order.toJSON()),
                purchaseOrders: purchaseOrders.map(order => order.toJSON())
            };
        } catch (error) {
            throw new Error(`Error fetching recent orders: ${error.message}`);
        }
    }

    static async getLowStockAlerts() {
        try {
            const lowStockItems = await Stock.findAll({
                where: literal('quantity <= minimum_stock_level'),
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
                order: [['quantity', 'ASC']],
                limit: 20
            });

            return lowStockItems.map(item => item.toJSON());
        } catch (error) {
            throw new Error(`Error fetching low stock alerts: ${error.message}`);
        }
    }

    static async getRevenueChart(days = 30) {
        try {
            return await SaleOrder.findAll({
                attributes: [
                    [fn('DATE', col('created_at')), 'date'],
                    [fn('SUM', col('total_amount')), 'revenue']
                ],
                where: {
                    status: 'DELIVERED',
                    created_at: {
                        [Op.gte]: literal(`DATE_SUB(NOW(), INTERVAL ${days} DAY)`)
                    }
                },
                group: [fn('DATE', col('created_at'))],
                order: [[fn('DATE', col('created_at')), 'ASC']],
                raw: true
            });
        } catch (error) {
            throw new Error(`Error fetching revenue chart data: ${error.message}`);
        }
    }

    static async getTopProducts(limit = 10) {
        try {
            return await SaleOrderItem.findAll({
                attributes: [
                    [fn('SUM', col('quantity')), 'total_sold'],
                    [fn('SUM', col('total_price')), 'total_revenue']
                ],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'product_name', 'sku_code']
                    },
                    {
                        model: SaleOrder,
                        as: 'saleOrder',
                        attributes: [],
                        where: {
                            status: 'DELIVERED',
                            created_at: {
                                [Op.gte]: literal('DATE_SUB(NOW(), INTERVAL 30 DAY)')
                            }
                        }
                    }
                ],
                group: ['product.id', 'product.product_name', 'product.sku_code'],
                order: [[fn('SUM', col('quantity')), 'DESC']],
                limit,
                raw: true
            });
        } catch (error) {
            throw new Error(`Error fetching top products: ${error.message}`);
        }
    }

    static async getRecentActivities(limit = 20) {
        try {
            const stockMovements = await StockMovement.findAll({
                attributes: [
                    [literal("'stock_movement'"), 'type'],
                    'created_at',
                    'movement_type',
                    'quantity'
                ],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'product_name']
                    },
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'username']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit
            });

            return stockMovements.map(movement => movement.toJSON());
        } catch (error) {
            throw new Error(`Error fetching recent activities: ${error.message}`);
        }
    }
}

export default DashboardService;
