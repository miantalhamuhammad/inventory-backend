import DashboardService from '../services/dashboardService.js';

class DashboardController {
    // GET /api/dashboard/stats
    static async getStats(req, res, next) {
        try {
            const stats = await DashboardService.getStats();
            res.success(stats, 'Dashboard statistics retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/dashboard/recent-orders
    static async getRecentOrders(req, res, next) {
        try {
            const { limit = 10 } = req.query;
            const orders = await DashboardService.getRecentOrders(parseInt(limit));
            res.success(orders, 'Recent orders retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/dashboard/low-stock-alerts
    static async getLowStockAlerts(req, res, next) {
        try {
            const alerts = await DashboardService.getLowStockAlerts();
            res.success(alerts, 'Low stock alerts retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/dashboard/revenue-chart
    static async getRevenueChart(req, res, next) {
        try {
            const { days = 30 } = req.query;
            const revenueData = await DashboardService.getRevenueChart(parseInt(days));
            res.success(revenueData, 'Revenue chart data retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/dashboard/top-products
    static async getTopProducts(req, res, next) {
        try {
            const { limit = 10 } = req.query;
            const topProducts = await DashboardService.getTopProducts(parseInt(limit));
            res.success(topProducts, 'Top products retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/dashboard/recent-activities
    static async getRecentActivities(req, res, next) {
        try {
            const { limit = 20 } = req.query;
            const activities = await DashboardService.getRecentActivities(parseInt(limit));
            res.success(activities, 'Recent activities retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default DashboardController;
