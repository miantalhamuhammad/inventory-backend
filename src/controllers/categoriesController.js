import CategoryService from '../services/categoryService.js';
import { validationResult } from 'express-validator';

class CategoriesController {
    // GET /api/categories
    static async getCategories(req, res, next) {
        try {
            const categories = await CategoryService.findAll(req.companyId);
            res.success(categories, 'Categories retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/categories/:id
    static async getCategory(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryService.findById(id, req.companyId);

            if (!category) {
                return res.error('Category not found', 404);
            }

            res.success(category, 'Category retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/categories
    static async createCategory(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            // Add company_id to category data
            const categoryData = {
                ...req.body,
                company_id: req.companyId
            };

            const category = await CategoryService.create(categoryData);
            res.success(category, 'Category created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/categories/:id
    static async updateCategory(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const updated = await CategoryService.update(id, req.body, req.companyId);

            if (!updated) {
                return res.error('Category not found or access denied', 404);
            }

            res.success(null, 'Category updated successfully');
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/categories/:id
    static async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await CategoryService.delete(id, req.companyId);

            if (!deleted) {
                return res.error('Category not found or access denied', 404);
            }

            res.success(null, 'Category deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/categories/tree
    static async getCategoryTree(req, res, next) {
        try {
            const tree = await CategoryService.getTree(req.companyId);
            res.success(tree, 'Category tree retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default CategoriesController;
