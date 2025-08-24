import { Customer, SaleOrder, Invoice } from '../models/index.js';
import { Op } from 'sequelize';

class CustomerService {
    static async create(customerData) {
        try {
            const customer = await Customer.create(customerData);
            return customer.toJSON();
        } catch (error) {
            throw new Error(`Error creating customer: ${error.message}`);
        }
    }

    static async findAll(page = 1, limit = 10, search = '', filters = {}) {
        try {
            const offset = (page - 1) * limit;
            const whereClause = {};

            if (search) {
                whereClause[Op.or] = [
                    { customer_name: { [Op.like]: `%${search}%` } },
                    { customer_id: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                ];
            }

            if (filters.customer_type) {
                whereClause.customer_type = filters.customer_type;
            }

            const { count, rows } = await Customer.findAndCountAll({
                where: whereClause,
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
            throw new Error(`Error fetching customers: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const customer = await Customer.findByPk(id);
            return customer;
        } catch (error) {
            throw new Error(`Error finding customer: ${error.message}`);
        }
    }

    static async update(id, customerData) {
        try {
            const [affectedRows] = await Customer.update(customerData, {
                where: { id },
            });
            return affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating customer: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const affectedRows = await Customer.destroy({
                where: { id },
            });
            return affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting customer: ${error.message}`);
        }
    }

    static async getOrders(customerId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const { count, rows } = await SaleOrder.findAndCountAll({
                where: { customer_id: customerId },
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
            throw new Error(`Error fetching customer orders: ${error.message}`);
        }
    }

    static async getInvoices(customerId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const { count, rows } = await Invoice.findAndCountAll({
                where: { customer_id: customerId },
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
            throw new Error(`Error fetching customer invoices: ${error.message}`);
        }
    }
}

export default CustomerService;
