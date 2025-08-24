import pool from '../config/dbconfig.js';

class ShipmentService {
    static async create(shipmentData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                `INSERT INTO shipments (
                    shipment_number, sale_order_id, warehouse_id, carrier_name, tracking_number,
                    shipping_date, expected_delivery_date, status, shipping_cost, notes, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    shipmentData.shipment_number, shipmentData.sale_order_id, shipmentData.warehouse_id,
                    shipmentData.carrier_name, shipmentData.tracking_number, shipmentData.shipping_date,
                    shipmentData.expected_delivery_date, shipmentData.status || 'PREPARING',
                    shipmentData.shipping_cost || 0, shipmentData.notes, shipmentData.created_by,
                ],
            );

            const shipmentId = result.insertId;

            // Add shipment items if provided
            if (shipmentData.items && shipmentData.items.length > 0) {
                for (const item of shipmentData.items) {
                    await connection.execute(
                        `INSERT INTO shipment_items (shipment_id, product_id, quantity, notes)
                         VALUES (?, ?, ?, ?)`,
                        [shipmentId, item.product_id, item.quantity, item.notes],
                    );
                }
            }

            await connection.commit();
            return { id: shipmentId, ...shipmentData };
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
                whereClause += ' AND (s.shipment_number LIKE ? OR s.tracking_number LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }

            if (filters.status) {
                whereClause += ' AND s.status = ?';
                params.push(filters.status);
            }

            const [rows] = await connection.execute(
                `SELECT s.*, so.so_number, w.warehouse_name 
                 FROM shipments s
                 LEFT JOIN sale_orders so ON s.sale_order_id = so.id
                 LEFT JOIN warehouses w ON s.warehouse_id = w.id
                 ${whereClause} ORDER BY s.created_at DESC LIMIT ? OFFSET ?`,
                [...params, limit, offset],
            );

            const [countResult] = await connection.execute(
                `SELECT COUNT(*) as total FROM shipments s ${whereClause}`,
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
                SELECT s.*, so.so_number, w.warehouse_name 
                FROM shipments s
                LEFT JOIN sale_orders so ON s.sale_order_id = so.id
                LEFT JOIN warehouses w ON s.warehouse_id = w.id
                WHERE s.id = ?
            `, [id]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async update(id, shipmentData) {
        const connection = await pool.getConnection();
        try {
            const fields = Object.keys(shipmentData).filter(key => shipmentData[key] !== undefined && key !== 'items');
            const values = fields.map(field => shipmentData[field]);
            const setClause = fields.map(field => `${field} = ?`).join(', ');

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            const [result] = await connection.execute(
                `UPDATE shipments SET ${setClause} WHERE id = ?`,
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
                'UPDATE shipments SET status = ? WHERE id = ?',
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
            const [result] = await connection.execute('DELETE FROM shipments WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    static async getTrackingInfo(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT s.shipment_number, s.tracking_number, s.carrier_name, s.shipping_date,
                       s.expected_delivery_date, s.actual_delivery_date, s.status
                FROM shipments s
                WHERE s.id = ?
            `, [id]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async addItems(shipmentId, items) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const item of items) {
                await connection.execute(
                    `INSERT INTO shipment_items (shipment_id, product_id, quantity, notes)
                     VALUES (?, ?, ?, ?)`,
                    [shipmentId, item.product_id, item.quantity, item.notes],
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

    static async getByOrder(orderId) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM shipments WHERE sale_order_id = ? ORDER BY created_at DESC',
                [orderId],
            );
            return rows;
        } finally {
            connection.release();
        }
    }
}

export default ShipmentService;
