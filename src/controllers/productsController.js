import ProductService from '../services/productService.js';
import { validationResult } from 'express-validator';

class ProductsController {
    // GET /api/products
    static async getProducts(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '', category_id: categoryId, supplier_id: supplierId } = req.query;
            const filters = { category_id: categoryId, supplier_id: supplierId };

            const result = await ProductService.findAll(
                parseInt(page),
                parseInt(limit),
                search,
                filters,
            );

            res.success(result, 'Products retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/products/:id
    static async getProduct(req, res, next) {
        try {
            const { id } = req.params;
            const product = await ProductService.findById(id);

            if (!product) {
                return res.error('Product not found', 404);
            }

            res.success(product, 'Product retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/products
    static async createProduct(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const product = await ProductService.create(req.body);
            res.success(product, 'Product created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/products/:id
    static async updateProduct(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const updated = await ProductService.update(id, req.body);

            if (!updated) {
                return res.error('Product not found', 404);
            }

            res.success(null, 'Product updated successfully');
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/products/:id
    static async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await ProductService.delete(id);

            if (!deleted) {
                return res.error('Product not found', 404);
            }

            res.success(null, 'Product deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/products/bulk-upload
    static async bulkUploadProducts(req, res, next) {
        try {
            const { products } = req.body;

            if (!Array.isArray(products) || products.length === 0) {
                return res.error('Products array is required', 400);
            }

            const result = await ProductService.bulkCreate(products);
            res.success(result, 'Products uploaded successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/products/search
    static async searchProducts(req, res, next) {
        try {
            const { q, page = 1, limit = 10 } = req.query;

            if (!q) {
                return res.error('Search query is required', 400);
            }

            const result = await ProductService.findAll(
                parseInt(page),
                parseInt(limit),
                q,
            );

            res.success(result, 'Products search completed');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/products/export
    static async exportProducts(req, res, next) {
        try {
            // For now, return all products - in production, you'd implement CSV/Excel export
            const result = await ProductService.findAll(1, 1000);
            res.success(result.data, 'Products exported successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/products/:id/images
    static async uploadProductImages(req, res, next) {
        try {
            const { id } = req.params;
            const { image_url: imageUrl, is_primary: isPrimary = false } = req.body;

            if (!imageUrl) {
                return res.error('Image URL is required', 400);
            }

            // This would typically handle file upload logic
            const imageData = { image_url: imageUrl, is_primary: isPrimary };
            const result = await ProductService.addImage(id, imageData);

            res.success(result, 'Product image uploaded successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/products/:id/images/:imageId
    static async deleteProductImage(req, res, next) {
        try {
            const { id, imageId } = req.params;
            const deleted = await ProductService.removeImage(id, imageId);

            if (!deleted) {
                return res.error('Product image not found', 404);
            }

            res.success(null, 'Product image deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default ProductsController;
