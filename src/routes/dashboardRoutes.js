import express from 'express';
import DashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// Dashboard routes
router.get('/stats', DashboardController.getStats);
router.get('/recent-orders', DashboardController.getRecentOrders);
router.get('/low-stock-alerts', DashboardController.getLowStockAlerts);
router.get('/revenue-chart', DashboardController.getRevenueChart);
router.get('/top-products', DashboardController.getTopProducts);
router.get('/recent-activities', DashboardController.getRecentActivities);

export default router;
