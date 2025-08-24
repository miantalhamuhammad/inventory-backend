import pool from '../config/dbconfig.js';

class SaleOrderService {
    static async create(orderData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                `INSERT INTO sale_orders (
                    so_number, customer_id, warehouse_id, order_date, expected_delivery_date,
                    status, subtotal, tax_amount, discount_amount, shipping_amount, 
                    payment_status, notes, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    orderData.so_number, orderData.customer_id, orderData.warehouse_id, orderData.order_date,
                    orderData.expected_delivery_date, orderData.status || 'PENDING', orderData.subtotal,
                    orderData.tax_amount || 0, orderData.discount_amount || 0, orderData.shipping_amount || 0,
                    orderData.payment_status || 'PENDING', orderData.notes, orderData.created_by,
                ],
            );

            const orderId = result.insertId;

            // Add order items if provided
            if (orderData.items && orderData.items.length > 0) {
                for (const item of orderData.items) {
                    await connection.execute(
                        `INSERT INTO sale_order_items (sale_order_id, product_id, quantity, unit_price, notes)
                         VALUES (?, ?, ?, ?, ?)`,
                        [orderId, item.product_id, item.quantity, item.unit_price, item.notes],
                    );
                }
            }

            await connection.commit();
            return { id: orderId, ...orderData };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findAll(page = 1, limit = 10, search = '', filters = {}) {
        const connection = await pool.getConnection();
        try {
            const offset = (page - 1) * limit;
            let whereClause = 'WHERE 1=1';
            const params = [];

            if (search) {
                whereClause += ' AND (so.so_number LIKE ? OR c.customer_name LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }

            if (filters.status) {
                whereClause += ' AND so.status = ?';
                params.push(filters.status);
            }

            if (filters.customer_id) {
                whereClause += ' AND so.customer_id = ?';
                params.push(filters.customer_id);
            }

            const [rows] = await connection.execute(
                `SELECT so.*, c.customer_name, w.warehouse_name 
                 FROM sale_orders so
                 LEFT JOIN customers c ON so.customer_id = c.id
                 LEFT JOIN warehouses w ON so.warehouse_id = w.id
                 ${whereClause} ORDER BY so.created_at DESC LIMIT ? OFFSET ?`,
                [...params, limit, offset],
            );

            const [countResult] = await connection.execute(
                `SELECT COUNT(*) as total FROM sale_orders so 
                 LEFT JOIN customers c ON so.customer_id = c.id ${whereClause}`,
                params,
            );

            return {
                data: rows,
                pagination: {
                    page,
                    limit,
                    total: countResult[0].total,
                    pages: Math.ceil(countResult[0].total / limit),
                },
            };
        } finally {
            connection.release();
        }
    }

    static async findById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT so.*, c.customer_name, w.warehouse_name 
                FROM sale_orders so
                LEFT JOIN customers c ON so.customer_id = c.id
                LEFT JOIN warehouses w ON so.warehouse_id = w.id
                WHERE so.id = ?
            `, [id]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async update(id, orderData) {
        const connection = await pool.getConnection();
        try {
            const fields = Object.keys(orderData).filter(key => orderData[key] !== undefined && key !== 'items');
            const values = fields.map(field => orderData[field]);
            const setClause = fields.map(field => `${field} = ?`).join(', ');

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            const [result] = await connection.execute(
                `UPDATE sale_orders SET ${setClause} WHERE id = ?`,
                [...values, id],
            );

            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    static async updateStatus(id, status) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'UPDATE sale_orders SET status = ? WHERE id = ?',
                [status, id],
            );
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('DELETE FROM sale_orders WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    static async getItems(orderId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT soi.*, p.product_name, p.sku_code 
                FROM sale_order_items soi
                LEFT JOIN products p ON soi.product_id = p.id
                WHERE soi.sale_order_id = ?
            `, [orderId]);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async addItem(orderId, itemData) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                `INSERT INTO sale_order_items (sale_order_id, product_id, quantity, unit_price, notes)
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, itemData.product_id, itemData.quantity, itemData.unit_price, itemData.notes],
            );
            return { id: result.insertId, ...itemData };
        } finally {
            connection.release();
        }
    }

    static async updateItem(orderId, itemId, itemData) {
        const connection = await pool.getConnection();
        try {
            const fields = Object.keys(itemData).filter(key => itemData[key] !== undefined);
            const values = fields.map(field => itemData[field]);
            const setClause = fields.map(field => `${field} = ?`).join(', ');

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            const [result] = await connection.execute(
                `UPDATE sale_order_items SET ${setClause} WHERE id = ? AND sale_order_id = ?`,
                [...values, itemId, orderId],
            );

            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    static async removeItem(orderId, itemId) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'DELETE FROM sale_order_items WHERE id = ? AND sale_order_id = ?',
                [itemId, orderId],
            );
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    static async shipItems(orderId, shippedItems, userId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const item of shippedItems) {
                // Update shipped quantity
                await connection.execute(
                    `UPDATE sale_order_items SET shipped_quantity = shipped_quantity + ? 
                     WHERE id = ? AND sale_order_id = ?`,
                    [item.quantity, item.item_id, orderId],
                );

                // Update stock
                await connection.execute(
                    `UPDATE stock SET quantity = quantity - ? 
                     WHERE product_id = ? AND warehouse_id = (SELECT warehouse_id FROM sale_orders WHERE id = ?)`,
                    [item.quantity, item.product_id, orderId],
                );

                // Record stock movement
                await connection.execute(
                    `INSERT INTO stock_movements (product_id, warehouse_id, quantity, movement_type, reference_type, reference_id, created_by)
                     VALUES (?, (SELECT warehouse_id FROM sale_orders WHERE id = ?), ?, 'OUT', 'SALE', ?, ?)`,
                    [item.product_id, orderId, item.quantity, orderId, userId],
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default SaleOrderService;
