import { Product, Category, Supplier } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class ProductService {
    static async create(productData) {
        try {
            const product = await Product.create(productData);
            return product.toJSON();
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    static async findAll(page = 1, limit = 10, search = '', filters = {}) {
        try {
            const offset = (page - 1) * limit;
            const whereClause = {};

            if (search) {
                whereClause[Op.or] = [
                    { product_name: { [Op.like]: `%${search}%` } },
                    { sku_code: { [Op.like]: `%${search}%` } },
                    { barcode_number: { [Op.like]: `%${search}%` } },
                ];
            }

            if (filters.category_id) {
                whereClause.category_id = filters.category_id;
            }

            if (filters.supplier_id) {
                whereClause.supplier_id = filters.supplier_id;
            }

            const { count, rows } = await Product.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name'],
                    },
                    {
                        model: Supplier,
                        as: 'supplier',
                        attributes: ['supplier_name'],
                    },
                ],
                limit,
                offset,
                order: [['created_at', 'DESC']],
            });

            return {
                data: rows,
                pagination: {
                    page,
                    limit,
                    total: count,
                    pages: Math.ceil(count / limit),
                },
            };
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const product = await Product.findByPk(id, {
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name'],
                    },
                    {
                        model: Supplier,
                        as: 'supplier',
                        attributes: ['supplier_name'],
                    },
                ],
            });
            return product;
        } catch (error) {
            throw new Error(`Error finding product: ${error.message}`);
        }
    }

    static async findBySku(skuCode) {
        try {
            const product = await Product.findOne({
                where: { sku_code: skuCode },
            });
            return product;
        } catch (error) {
            throw new Error(`Error finding product by SKU: ${error.message}`);
        }
    }

    static async update(id, productData) {
        try {
            const [affectedRows] = await Product.update(productData, {
                where: { id },
            });
            return affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const affectedRows = await Product.destroy({
                where: { id },
            });
            return affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    static async bulkCreate(productsData) {
        const transaction = await sequelize.transaction();
        try {
            const products = await Product.bulkCreate(productsData, {
                transaction,
                validate: true,
            });

            await transaction.commit();
            return products;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error bulk creating products: ${error.message}`);
        }
    }
}

export default ProductService;
