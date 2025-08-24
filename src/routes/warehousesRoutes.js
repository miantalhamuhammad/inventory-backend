import express from 'express';
import WarehousesController from '../controllers/warehousesController.js';

const router = express.Router();

// Warehouse routes
router.get('/', WarehousesController.getWarehouses);
router.get('/:id', WarehousesController.getWarehouse);
router.get('/:id/stock', WarehousesController.getWarehouseStock);
router.get('/:id/capacity', WarehousesController.getWarehouseCapacity);
router.post('/', WarehousesController.createWarehouse);
router.put('/:id', WarehousesController.updateWarehouse);
router.delete('/:id', WarehousesController.deleteWarehouse);

export default router;
