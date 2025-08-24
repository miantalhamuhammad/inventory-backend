import express from 'express';
import ProductsController from '../controllers/productsController.js';

const router = express.Router();

// Product routes
router.get('/', ProductsController.getProducts);
router.get('/search', ProductsController.searchProducts);
router.get('/export', ProductsController.exportProducts);
router.get('/:id', ProductsController.getProduct);
router.post('/', ProductsController.createProduct);
router.put('/:id', ProductsController.updateProduct);
router.delete('/:id', ProductsController.deleteProduct);
router.post('/bulk-upload', ProductsController.bulkUploadProducts);
router.post('/:id/images', ProductsController.uploadProductImages);
router.delete('/:id/images/:imageId', ProductsController.deleteProductImage);

export default router;
