import express from 'express';
import { Op } from 'sequelize';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Helper to generate a unique shipment number
function generateShipmentId() {
    return 'SHIP-' + Date.now();
}

// Helper to generate a unique tracking number
function generateTrackingId() {
    return 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Helper to calculate estimated delivery date (5 days from now)
function calculateETD(saleOrder) {
    const shippingDate = new Date();
    const etd = new Date(shippingDate);
    etd.setDate(etd.getDate() + 5);
    return etd;
}

// GET /api/sale-orders - Get all sale orders
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status, startDate, endDate } = req.query;
        const offset = (page - 1) * limit;

        const { SaleOrder, Customer, SaleOrderItem, Product } = req.app.get('models');

        let whereClause = {};
        if (status) whereClause.status = status;

        // Date filter
        if (startDate && endDate) {
            whereClause.created_at = { [Op.between]: [startDate + ' 00:00:00', endDate + ' 23:59:59'] };
        } else if (startDate) {
            whereClause.created_at = { [Op.gte]: startDate + ' 00:00:00' };
        } else if (endDate) {
            whereClause.created_at = { [Op.lte]: endDate + ' 23:59:59' };
        }

        if (search) {
            whereClause[Op.or] = [
                { so_number: { [Op.iLike]: `%${search}%` } },
                { '$customer.customer_name$': { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows: saleOrders } = await SaleOrder.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Customer,
                    as: 'customer'
                },
                {
                    model: SaleOrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        const totalPages = Math.ceil(count / limit);

        res.json({
            success: true,
            message: 'Sale orders retrieved successfully',
            data: {
                saleOrders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching sale orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// POST /api/sale-orders - Create new sale order
// router.post('/', async (req, res) => {
//     try {
//         const { SaleOrder, Shipment } = req.app.get('models');
//         const orderData = req.body;
//
//         const saleOrder = await SaleOrder.create(orderData);
//
//         // If the order is shipped, create a shipment
//         if (saleOrder.status && saleOrder.status.toLowerCase() === 'shipped') {
//             if (!req.user?.id) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Authenticated user required to create shipment.'
//                 });
//             }
//             await Shipment.create({
//                 shipment_number: generateShipmentId(),
//                 sale_order_id: saleOrder.id,
//                 warehouse_id: saleOrder.warehouse_id || null,
//                 carrier_name: saleOrder.carrier_name || null,
//                 tracking_number: generateTrackingId(),
//                 shipping_date: new Date(),
//                 expected_delivery_date: calculateETD(saleOrder),
//                 status: 'SHIPPED',
//                 created_by: updaorderData.created_by
//             });
//         }
//
//         res.status(201).json({
//             success: true,
//             message: 'Sale order created successfully',
//             data: saleOrder
//         });
//     } catch (error) {
//         console.error('Error creating sale order:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });
const generateSONumber = () => `SO-${Date.now()}`;
router.post('/', async (req, res) => {
  const transaction = await req.app.get('models').sequelize.transaction();
  try {
    const { SaleOrder, SaleOrderItem } = req.app.get('models');
    const orderData = req.body;

    // ✅ Calculate totals
    let subtotal = 0;
    if (Array.isArray(orderData.items)) {
      subtotal = orderData.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price);
      }, 0);
    }
    const total_amount = subtotal; // (add tax/discount logic if needed)

    // ✅ Map to DB fields
    const mappedData = {
      so_number: generateSONumber(),
      customer_id: orderData.customer_id || orderData.customerId,
      warehouse_id: orderData.warehouse_id || orderData.warehouseId,
      order_date: orderData.order_date || orderData.orderDate,
      status: orderData.status || 'PENDING',
      subtotal,
      total_amount,
      payment_terms: orderData.paymentTerms || null,
      notes: orderData.notes || null,
      created_by: req.user?.id || orderData.createdBy,
    };

    // ✅ Create Sale Order
    const saleOrder = await SaleOrder.create(mappedData, { transaction });

    // ✅ Create Sale Order Items
    if (Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        await SaleOrderItem.create({
          sale_order_id: saleOrder.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price, // ✅ FIX HERE
          notes: item.notes || null,
        }, { transaction });
      }
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Sale order created successfully',
      data: saleOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating sale order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/sale-orders/:id - Get single sale order
router.get('/:id', async (req, res) => {
    try {
        const { SaleOrder, Customer, SaleOrderItem, Product } = req.app.get('models');
        const { id } = req.params;

        const saleOrder = await SaleOrder.findByPk(id, {
            include: [
                {
                    model: Customer,
                    as: 'customer'
                },
                {
                    model: SaleOrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });

        if (!saleOrder) {
            return res.status(404).json({
                success: false,
                message: 'Sale order not found'
            });
        }

        res.json({
            success: true,
            message: 'Sale order retrieved successfully',
            data: saleOrder
        });
    } catch (error) {
        console.error('Error fetching sale order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// PATCH /api/sale-orders/:id/status - Update sale order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { SaleOrder, Shipment } = req.app.get('models');
        const { id } = req.params;
        const { status } = req.body;

        // Use the static helper method from the model
        const updatedRowsCount = await SaleOrder.updateStatus(id, status);

        if (!updatedRowsCount || (Array.isArray(updatedRowsCount) && updatedRowsCount[0] === 0)) {
            return res.status(404).json({
                success: false,
                message: 'Sale order not found'
            });
        }

        const updatedOrder = await SaleOrder.findByPk(id);

        console.log("Updated Order:", updatedOrder.created_by);
        // If the new status is shipped, create a shipment if not already exists
        if (updatedOrder.status && updatedOrder.status.toLowerCase() === 'shipped') {
            const existingShipment = await Shipment.findOne({ where: { sale_order_id: updatedOrder.id } });
            if (!existingShipment) {
                await Shipment.create({
                    shipment_number: generateShipmentId(),
                    sale_order_id: updatedOrder.id,
                    warehouse_id: updatedOrder.warehouse_id || null,
                    carrier_name: updatedOrder.carrier_name || null,
                    tracking_number: generateTrackingId(),
                    shipping_date: new Date(),
                    expected_delivery_date: calculateETD(updatedOrder),
                    status: 'SHIPPED',
                    created_by: updatedOrder.created_by
                });
            }
        }

        res.json({
            success: true,
            message: 'Sale order status updated successfully',
            data: updatedOrder
        });
    } catch (error) {
        console.error('Error updating sale order status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// POST /api/sale-orders/:id/invoice - Generate invoice for sale order
router.post('/:id/invoice', async (req, res) => {
    try {
        const { SaleOrder, Invoice } = req.app.get('models');
        const { id } = req.params;

        const saleOrder = await SaleOrder.findByPk(id);
        if (!saleOrder) {
            return res.status(404).json({
                success: false,
                message: 'Sale order not found'
            });
        }

        // Create invoice for the sale order
        const invoice = await Invoice.create({
            sale_order_id: id,
            invoice_number: `INV-${Date.now()}`,
            total_amount: saleOrder.total_amount,
            status: 'Generated',
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });

        // Update sale order to mark invoice as generated
        await SaleOrder.update(
            { invoice_generated: true },
            { where: { id } }
        );

        res.json({
            success: true,
            message: 'Invoice generated successfully',
            data: invoice
        });
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// DELETE /api/sale-orders/:id - Delete sale order
router.delete('/:id', async (req, res) => {
    try {
        const { SaleOrder } = req.app.get('models');
        const { id } = req.params;

        const deletedRowsCount = await SaleOrder.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sale order not found'
            });
        }

        res.json({
            success: true,
            message: 'Sale order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting sale order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/sale-orders/export - Export sale orders
router.get('/export', async (req, res) => {
    try {
        const { format = 'csv' } = req.query;
        const { SaleOrder, Customer } = req.app.get('models');

        const orders = await SaleOrder.findAll({
            include: [
                {
                    model: Customer,
                    as: 'customer'
                }
            ],
            order: [['created_at', 'DESC']]
        });

        if (format === 'csv') {
            const csvHeaders = 'ID,Order Number,Customer,Total Amount,Status,Created At\n';
            const csvContent = orders.map(order => [
                order.id,
                order.order_number,
                order.customer?.customer_name || '',
                order.total_amount,
                order.status,
                order.created_at
            ].join(',')).join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=sale-orders-export.csv');
            res.send(csvHeaders + csvContent);
        } else {
            res.json({
                success: true,
                message: 'Sale orders exported successfully',
                data: orders
            });
        }
    } catch (error) {
        console.error('Error exporting sale orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;
