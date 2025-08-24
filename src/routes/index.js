import express from 'express';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import productsRoutes from './productsRoutes.js';
import categoriesRoutes from './categoriesRoutes.js';
import suppliersRoutes from './suppliersRoutes.js';
import customersRoutes from './customersRoutes.js';
import warehousesRoutes from './warehousesRoutes.js';
import rolesRoutes from './rolesRoutes.js';
import permissionsRoutes from './permissionsRoutes.js';
import usersRoutes from './usersRoutes.js';
import stockRoutes from './stockRoutes.js';
import purchaseOrderRoutes from './purchaseOrderRoutes.js';
import saleOrderRoutes from './saleOrderRoutes.js';
import shipmentRoutes from './shipmentRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import supplierRegistrationRoutes from './supplierRegistration.routes.js';

const router = express.Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/suppliers', suppliersRoutes);
router.use('/customers', customersRoutes);
router.use('/warehouses', warehousesRoutes);
router.use('/roles', rolesRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/users', usersRoutes);
router.use('/stock', stockRoutes);
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/sale-orders', saleOrderRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/supplier', supplierRoutes);  // Supplier panel endpoints
router.use('/', supplierRegistrationRoutes); // Public supplier registration endpoint

export default router;