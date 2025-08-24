import { Category, Product } from '../models/index.js';

class CategoryService {
    static async create(categoryData) {
        try {
            const category = await Category.create(categoryData);
            return category.toJSON();
        } catch (error) {
            throw new Error(`Error creating category: ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const categories = await Category.findAll({
                include: [
                    {
                        model: Category,
                        as: 'parent',
                        attributes: ['name'],
                    },
                ],
                order: [['created_at', 'DESC']],
            });
            return categories;
        } catch (error) {
            throw new Error(`Error fetching categories: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const category = await Category.findByPk(id, {
                include: [
                    {
                        model: Category,
                        as: 'parent',
                        attributes: ['name'],
                    },
                ],
            });
            return category;
        } catch (error) {
            throw new Error(`Error finding category: ${error.message}`);
        }
    }

    static async getTree() {
        try {
            const categories = await Category.findAll({
                order: [['parent_id', 'ASC'], ['name', 'ASC']],
            });

            // Build hierarchical tree
            const categoryMap = new Map();
            const rootCategories = [];

            categories.forEach(category => {
                categoryMap.set(category.id, {
                    ...category.toJSON(),
                    children: [],
                });
            });

            categories.forEach(category => {
                if (category.parent_id) {
                    const parent = categoryMap.get(category.parent_id);
                    if (parent) {
                        parent.children.push(categoryMap.get(category.id));
                    }
                } else {
                    rootCategories.push(categoryMap.get(category.id));
                }
            });

            return rootCategories;
        } catch (error) {
            throw new Error(`Error building category tree: ${error.message}`);
        }
    }

    static async update(id, categoryData) {
        try {
            const [affectedRows] = await Category.update(categoryData, {
                where: { id },
            });
            return affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating category: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            // Check if category has children
            const childrenCount = await Category.count({
                where: { parent_id: id },
            });

            if (childrenCount > 0) {
                throw new Error('Cannot delete category with subcategories');
            }

            // Check if category has products
            const productsCount = await Product.count({
                where: { category_id: id },
            });

            if (productsCount > 0) {
                throw new Error('Cannot delete category with products');
            }

            const affectedRows = await Category.destroy({
                where: { id },
            });
            return affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting category: ${error.message}`);
        }
    }
}

export default CategoryService;
