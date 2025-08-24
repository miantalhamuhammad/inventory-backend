import express from 'express';
import CategoriesController from '../controllers/categoriesController.js';

const router = express.Router();

// Category routes
router.get('/', CategoriesController.getCategories);
router.get('/tree', CategoriesController.getCategoryTree);
router.get('/:id', CategoriesController.getCategory);
router.post('/', CategoriesController.createCategory);
router.put('/:id', CategoriesController.updateCategory);
router.delete('/:id', CategoriesController.deleteCategory);

export default router;
