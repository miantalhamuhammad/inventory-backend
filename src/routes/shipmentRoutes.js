import express from 'express';
import { Op } from 'sequelize';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/shipments - Get all shipments
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;
        const offset = (page - 1) * limit;

        const { Shipment, SaleOrder, Customer } = req.app.get('models');

        let whereClause = {};
        if (status) whereClause.status = status;

        if (search) {
            whereClause[Op.or] = [
                { shipment_number: { [Op.iLike]: `%${search}%` } },
                { tracking_number: { [Op.iLike]: `%${search}%` } },
                { '$saleOrder.customer.customer_name$': { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows: shipments } = await Shipment.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: SaleOrder,
                    as: 'saleOrder',
                    include: [
                        {
                            model: Customer,
                            as: 'customer'
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
            message: 'Shipments retrieved successfully',
            data: {
                shipments,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// POST /api/shipments - Create new shipment
router.post('/', async (req, res) => {
    try {
        const { Shipment } = req.app.get('models');
        const shipmentData = req.body;

        // Generate tracking number if not provided
        if (!shipmentData.tracking_number) {
            shipmentData.tracking_number = `TRACK-${Date.now()}`;
        }

        const shipment = await Shipment.create(shipmentData);

        res.status(201).json({
            success: true,
            message: 'Shipment created successfully',
            data: shipment
        });
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/shipments/:id - Get single shipment
router.get('/:id', async (req, res) => {
    try {
        const { Shipment, Customer, SaleOrder, ShipmentItem, Product } = req.app.get('models');
        const { id } = req.params;

        const shipment = await Shipment.findByPk(id, {
            include: [
                {
                    model: Customer,
                    as: 'customer'
                },
                {
                    model: SaleOrder,
                    as: 'saleOrder'
                },
                {
                    model: ShipmentItem,
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

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        res.json({
            success: true,
            message: 'Shipment retrieved successfully',
            data: shipment
        });
    } catch (error) {
        console.error('Error fetching shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// PATCH /api/shipments/:id/status - Update shipment status
router.patch('/:id/status', async (req, res) => {
    try {
        const { Shipment } = req.app.get('models');
        const { id } = req.params;
        const { status } = req.body;

        const [updatedRowsCount] = await Shipment.update(
            { status },
            { where: { id } }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        const updatedShipment = await Shipment.findByPk(id);

        res.json({
            success: true,
            message: 'Shipment status updated successfully',
            data: updatedShipment
        });
    } catch (error) {
        console.error('Error updating shipment status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/shipments/track/:trackingNumber - Track shipment
router.get('/track/:trackingNumber', async (req, res) => {
    try {
        const { Shipment, Customer, SaleOrder } = req.app.get('models');
        const { trackingNumber } = req.params;

        const shipment = await Shipment.findOne({
            where: { tracking_number: trackingNumber },
            include: [
                {
                    model: Customer,
                    as: 'customer'
                },
                {
                    model: SaleOrder,
                    as: 'saleOrder'
                }
            ]
        });

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        res.json({
            success: true,
            message: 'Shipment tracking information retrieved successfully',
            data: {
                tracking_number: shipment.tracking_number,
                status: shipment.status,
                shipped_date: shipment.shipped_date,
                estimated_delivery_date: shipment.estimated_delivery_date,
                destination_address: shipment.destination_address,
                destination_city: shipment.destination_city,
                destination_state: shipment.destination_state,
                customer: shipment.customer
            }
        });
    } catch (error) {
        console.error('Error tracking shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// DELETE /api/shipments/:id - Delete shipment
router.delete('/:id', async (req, res) => {
    try {
        const { Shipment } = req.app.get('models');
        const { id } = req.params;

        const deletedRowsCount = await Shipment.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        res.json({
            success: true,
            message: 'Shipment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/shipments/:id/label - Generate shipping label
router.get('/:id/label', async (req, res) => {
    try {
        const { Shipment, Customer } = req.app.get('models');
        const { id } = req.params;

        const shipment = await Shipment.findByPk(id, {
            include: [
                {
                    model: Customer,
                    as: 'customer'
                }
            ]
        });

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        // For now, return a simple text response
        // In a real application, you would generate a PDF label
        const labelContent = `
SHIPPING LABEL
--------------
Tracking: ${shipment.tracking_number}
To: ${shipment.customer?.customer_name}
Address: ${shipment.destination_address}
City: ${shipment.destination_city}, ${shipment.destination_state}
        `;

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename=shipping-label-${id}.txt`);
        res.send(labelContent);
    } catch (error) {
        console.error('Error generating shipping label:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/shipments/export - Export shipments
router.get('/export', async (req, res) => {
    try {
        const { format = 'csv' } = req.query;
        const { Shipment, Customer } = req.app.get('models');

        const shipments = await Shipment.findAll({
            include: [
                {
                    model: Customer,
                    as: 'customer'
                }
            ],
            order: [['created_at', 'DESC']]
        });

        if (format === 'csv') {
            const csvHeaders = 'ID,Shipment Number,Tracking Number,Customer,Status,Destination,Created At\n';
            const csvContent = shipments.map(shipment => [
                shipment.id,
                shipment.shipment_number,
                shipment.tracking_number,
                shipment.customer?.customer_name || '',
                shipment.status,
                `${shipment.destination_city}, ${shipment.destination_state}`,
                shipment.created_at
            ].join(',')).join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=shipments-export.csv');
            res.send(csvHeaders + csvContent);
        } else {
            res.json({
                success: true,
                message: 'Shipments exported successfully',
                data: shipments
            });
        }
    } catch (error) {
        console.error('Error exporting shipments:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;
