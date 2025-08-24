import express from 'express';
import { Op } from 'sequelize';
import { authenticateToken } from '../middlewares/auth.js';
import { generatePONumber } from '../utils/numberGenerator.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/purchase-orders - Get all purchase orders
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status, startDate, endDate } = req.query;
        const offset = (page - 1) * limit;

        const { PurchaseOrder, Supplier, PurchaseOrderItem, Product } = req.app.get('models');

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
                { order_number: { [Op.iLike]: `%${search}%` } },
                { '$supplier.supplier_name$': { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows: purchaseOrders } = await PurchaseOrder.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Supplier,
                    as: 'supplier'
                },
                {
                    model: PurchaseOrderItem,
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
            message: 'Purchase orders retrieved successfully',
            data: {
                purchaseOrders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching purchase orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// POST /api/purchase-orders - Create new purchase order
router.post('/', async (req, res) => {
  try {
    const { PurchaseOrder, PurchaseOrderItem } = req.app.get('models');
    const orderData = req.body;

    console.log('=== PO Creation Debug ===');
    console.log('Incoming orderData:', orderData);

    // ✅ Generate unique PO number using proper utility function
    const po_number = await generatePONumber();
    console.log('Generated PO number:', po_number);

    const mappedData = {
      po_number: po_number, // ✅ Use generated unique PO number
      supplier_id: orderData.supplierId,
      warehouse_id: orderData.warehouseId,
      order_date: orderData.orderDate,
      expected_delivery_date: orderData.expectedDeliveryDate,
      subtotal: parseFloat(orderData.quantity) * parseFloat(orderData.unitPrice),
      tax_amount: 0,
      discount_amount: 0,
      total_amount: parseFloat(orderData.totalAmount),
      payment_terms: orderData.paymentTerms,
      notes: orderData.notes,
      created_by: orderData.createdBy,
    };

    console.log("Final Mapped Data:", mappedData);

    // Create the purchase order
    const purchaseOrder = await PurchaseOrder.create(mappedData);
    console.log("Created PO:", purchaseOrder.toJSON());

    // Create the purchase order item if product data is provided
    if (orderData.productId && orderData.quantity && orderData.unitPrice) {
      const itemData = {
        purchase_order_id: purchaseOrder.id,
        product_id: orderData.productId,
        quantity: parseInt(orderData.quantity),
        unit_price: parseFloat(orderData.unitPrice),
        total_price: parseFloat(orderData.quantity) * parseFloat(orderData.unitPrice),
        notes: orderData.notes || null
      };

      console.log("Creating PO Item:", itemData);
      const purchaseOrderItem = await PurchaseOrderItem.create(itemData);
      console.log("Created PO Item:", purchaseOrderItem.toJSON());
    }

    // Fetch the complete purchase order with items and associations
    const completePurchaseOrder = await PurchaseOrder.findByPk(purchaseOrder.id, {
      include: [
        {
          model: PurchaseOrderItem,
          as: 'items',
          include: [
            {
              model: req.app.get('models').Product,
              as: 'product',
              attributes: ['id', 'product_name', 'sku_code', 'description']
            }
          ]
        },
        {
          model: req.app.get('models').Supplier,
          as: 'supplier',
          attributes: ['id', 'supplier_name', 'contact_person', 'email']
        },
        {
          model: req.app.get('models').Warehouse,
          as: 'warehouse',
          attributes: ['id', 'warehouse_name', 'location']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: completePurchaseOrder,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "PO number already exists, please try again",
      });
    }

    console.error('Error creating purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});


// GET /api/purchase-orders/:id - Get single purchase order
router.get('/:id', async (req, res) => {
    try {
        const { PurchaseOrder, Supplier, PurchaseOrderItem, Product } = req.app.get('models');
        const { id } = req.params;

        const purchaseOrder = await PurchaseOrder.findByPk(id, {
            include: [
                {
                    model: Supplier,
                    as: 'supplier'
                },
                {
                    model: PurchaseOrderItem,
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

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.json({
            success: true,
            message: 'Purchase order retrieved successfully',
            data: purchaseOrder
        });
    } catch (error) {
        console.error('Error fetching purchase order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// PATCH /api/purchase-orders/:id/status - Update purchase order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { PurchaseOrder } = req.app.get('models');
        const { id } = req.params;
        const { status } = req.body;

        const [updatedRowsCount] = await PurchaseOrder.update(
            { status },
            { where: { id } }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        const updatedOrder = await PurchaseOrder.findByPk(id);

        res.json({
            success: true,
            message: 'Purchase order status updated successfully',
            data: updatedOrder
        });
    } catch (error) {
        console.error('Error updating purchase order status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// DELETE /api/purchase-orders/:id - Delete purchase order
router.delete('/:id', async (req, res) => {
    try {
        const { PurchaseOrder } = req.app.get('models');
        const { id } = req.params;

        const deletedRowsCount = await PurchaseOrder.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.json({
            success: true,
            message: 'Purchase order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting purchase order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/purchase-orders/export - Export purchase orders
router.get('/export', async (req, res) => {
    try {
        const { format = 'csv' } = req.query;
        const { PurchaseOrder, Supplier } = req.app.get('models');

        const orders = await PurchaseOrder.findAll({
            include: [
                {
                    model: Supplier,
                    as: 'supplier'
                }
            ],
            order: [['created_at', 'DESC']]
        });

        if (format === 'csv') {
            const csvHeaders = 'ID,Order Number,Supplier,Total Amount,Status,Created At\n';
            const csvContent = orders.map(order => [
                order.id,
                order.order_number,
                order.supplier?.supplier_name || '',
                order.total_amount,
                order.status,
                order.created_at
            ].join(',')).join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=purchase-orders-export.csv');
            res.send(csvHeaders + csvContent);
        } else {
            res.json({
                success: true,
                message: 'Purchase orders exported successfully',
                data: orders
            });
        }
    } catch (error) {
        console.error('Error exporting purchase orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;
