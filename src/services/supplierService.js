import db from '../models/index.js';
import { Op } from 'sequelize';

class SupplierService {
  async getSupplierProfile(userId) {
    try {
      // Query user with correct field names - using 'username' instead of 'name'
      const user = await db.User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'role_id'],
        include: [
          {
            model: db.Role,
            as: 'role',
            attributes: ['id', 'name']
          }
        ]
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has supplier role
      const isSupplier = user.role && user.role.name === 'supplier';

      if (!isSupplier) {
        throw new Error('User is not a supplier');
      }

      // Try to find associated supplier entity data
      let supplierEntity = null;
      try {
        supplierEntity = await db.Supplier.findOne({
          where: {
            user_id: userId  // Direct user_id link if exists
          }
        });

        // If no direct link, try email match
        if (!supplierEntity) {
          supplierEntity = await db.Supplier.findOne({
            where: { email: user.email }
          });
        }
      } catch (error) {
        console.log('No specific supplier entity found for user:', userId);
      }

      return {
        user: {
          id: user.id,
          name: user.username, // Map username to name for frontend compatibility
          username: user.username,
          email: user.email,
          role_id: user.role_id,
          role: user.role
        },
        supplier: supplierEntity,
        isSupplier: true
      };
    } catch (error) {
      throw error;
    }
  }

  async updateSupplierProfile(userId, profileData) {
    try {
      const user = await db.User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update user data if provided
      if (profileData.username || profileData.email) {
        await user.update({
          username: profileData.username || user.username,
          email: profileData.email || user.email
        });
      }

      // Handle supplier entity data if provided
      if (profileData.supplier) {
        let supplierEntity = await db.Supplier.findOne({
          where: { user_id: userId }
        });

        if (!supplierEntity) {
          supplierEntity = await db.Supplier.findOne({
            where: { email: user.email }
          });
        }

        if (supplierEntity) {
          await supplierEntity.update(profileData.supplier);
        } else {
          // Create new supplier entity
          supplierEntity = await db.Supplier.create({
            ...profileData.supplier,
            user_id: userId,
            email: user.email
          });
        }
      }

      return this.getSupplierProfile(userId);
    } catch (error) {
      throw error;
    }
  }

  // PO Requests methods
  async getPORequests(userId, options = {}) {
    try {
      const { status, page = 1, limit = 10 } = options;

      // Find supplier entity linked to this user
      const supplier = await this.findSupplierByUserId(userId);
      if (!supplier) {
        throw new Error('Supplier not found for this user');
      }

      const whereClause = {
        supplier_id: supplier.id
      };

      if (status) {
        whereClause.status = status;
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await db.PurchaseOrder.findAndCountAll({
        where: whereClause,
        attributes: [
          'id',
          'po_number',
          'order_date',
          'expected_delivery_date',
          'status',
          'total_amount',
          'notes',
          'created_at'
        ],
        include: [
          {
            model: db.Warehouse,
            as: 'warehouse',
            attributes: ['id', 'warehouse_name', 'location']
          },
          {
            model: db.PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: db.Product,
                as: 'product',
                attributes: ['id', 'product_name', 'sku_code']
              }
            ]
          }
        ],
        limit: limit,
        offset: offset,
        order: [['created_at', 'DESC']]
      });

      return {
        data: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getPORequestDetail(userId, poRequestId) {
    try {
      const supplier = await this.findSupplierByUserId(userId);
      if (!supplier) {
        throw new Error('Supplier not found for this user');
      }

      const poRequest = await db.PurchaseOrder.findOne({
        where: {
          id: poRequestId,
          supplier_id: supplier.id
        },
        include: [
          {
            model: db.Warehouse,
            as: 'warehouse'
          },
          {
            model: db.PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: db.Product,
                as: 'product'
              }
            ]
          },
          {
            model: db.User,
            as: 'creator',
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      if (!poRequest) {
        throw new Error('PO request not found or access denied');
      }

      return poRequest;
    } catch (error) {
      throw error;
    }
  }

  // Quotations methods
  async getQuotations(userId, options = {}) {
    try {
      const { status, page = 1, limit = 10 } = options;

      const supplier = await this.findSupplierByUserId(userId);
      if (!supplier) {
        throw new Error('Supplier not found for this user');
      }

      const whereClause = {
        supplier_id: supplier.id
      };

      if (status) {
        whereClause.status = status;
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await db.SupplierQuotation.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: db.PurchaseOrder,
            as: 'purchaseOrder',
            attributes: [
              'id',
              'po_number',
              'order_date'
            ]
          },
          {
            model: db.SupplierQuotationItem,
            as: 'items',
            include: [
              {
                model: db.Product,
                as: 'product',
                attributes: ['id', 'product_name', 'sku_code']
              }
            ]
          }
        ],
        limit: limit,
        offset: offset,
        order: [['created_at', 'DESC']]
      });

      return {
        data: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async submitQuotation(userId, quotationData) {
    try {
      const supplier = await this.findSupplierByUserId(userId);
      if (!supplier) {
        throw new Error('Supplier not found for this user');
      }

      // Create quotation with items
      const quotation = await db.SupplierQuotation.create({
        supplier_id: supplier.id,
        purchase_order_id: quotationData.purchase_order_id,
        quotation_number: quotationData.quotation_number,
        quotation_date: new Date(), // Add the required quotation_date field
        total_amount: quotationData.total_amount,
        subtotal: quotationData.subtotal,
        tax_amount: quotationData.tax_amount || 0,
        discount_amount: quotationData.discount_amount || 0,
        lead_time_days: quotationData.lead_time_days,
        valid_until: quotationData.valid_until,
        terms_and_conditions: quotationData.terms_and_conditions,
        remarks: quotationData.remarks,
        status: 'SUBMITTED'
      });

      // Create quotation items
      if (quotationData.items && quotationData.items.length > 0) {
        const items = quotationData.items.map(item => ({
          quotation_id: quotation.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          specifications: item.specifications,
          remarks: item.remarks
        }));

        await db.SupplierQuotationItem.bulkCreate(items);
      }

      return this.getQuotationDetail(userId, quotation.id);
    } catch (error) {
      throw error;
    }
  }

  async getQuotationDetail(userId, quotationId) {
    try {
      const supplier = await this.findSupplierByUserId(userId);
      if (!supplier) {
        throw new Error('Supplier not found for this user');
      }

      const quotation = await db.SupplierQuotation.findOne({
        where: {
          id: quotationId,
          supplier_id: supplier.id
        },
        include: [
          {
            model: db.PurchaseOrder,
            as: 'purchaseOrder'
          },
          {
            model: db.SupplierQuotationItem,
            as: 'items',
            include: [
              {
                model: db.Product,
                as: 'product'
              }
            ]
          }
        ]
      });

      if (!quotation) {
        throw new Error('Quotation not found or access denied');
      }

      return quotation;
    } catch (error) {
      throw error;
    }
  }

  // Helper method to find supplier by user ID
  async findSupplierByUserId(userId) {
    const user = await db.User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Try direct user_id link first
    let supplier = await db.Supplier.findOne({
      where: { user_id: userId }
    });

    // If no direct link, try email match
    if (!supplier) {
      supplier = await db.Supplier.findOne({
        where: { email: user.email }
      });
    }

    return supplier;
  }

  //new
  // Inside SupplierService class

// Find all suppliers with pagination + search
  async findAll(page = 1, limit = 10, search = '', filters = {}) {
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (filters.category) {
      whereClause.category = filters.category;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await db.Supplier.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    };
  }

// Find by ID
  async findById(id) {
    return await db.Supplier.findByPk(id, {
      include: [{ model: db.User, as: 'user', attributes: ['id', 'username', 'email'] }]
    });
  }

// Create
  async create(data) {
    return await db.Supplier.create(data);
  }

// Update
  async update(id, data) {
    const supplier = await db.Supplier.findByPk(id);
    if (!supplier) return null;
    await supplier.update(data);
    return supplier;
  }

// Delete
  async delete(id) {
    const supplier = await db.Supplier.findByPk(id);
    if (!supplier) return null;
    await supplier.destroy();
    return true;
  }

// Get products for supplier
  async getProducts(supplierId) {
    return await db.Product.findAll({
      where: { supplier_id: supplierId }
    });
  }

// Get orders for supplier
  async getOrders(supplierId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.PurchaseOrder.findAndCountAll({
      where: { supplier_id: supplierId },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    };
  }

// Find suppliers that have linked users with supplier role
  async findSuppliersWithUsers(page = 1, limit = 10, search = '', filters = {}) {
    const offset = (page - 1) * limit;

    const whereClause = {};
    const userWhereClause = {};

    // Add search functionality for supplier fields
    if (search) {
      whereClause[Op.or] = [
        { supplier_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { contact_person: { [Op.like]: `%${search}%` } }
      ];
    }

    if (filters.category) {
      whereClause.category = filters.category;
    }

    const { count, rows } = await db.Supplier.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.User,
        as: 'user',
        required: false, // LEFT JOIN to include suppliers even without users
        where: userWhereClause,
        attributes: ['id', 'username', 'email', 'role_id'],
        include: [{
          model: db.Role,
          as: 'role',
          required: false,
          attributes: ['id', 'name']
        }]
      }],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    };
  }

  // Find suppliers that have linked users specifically with supplier role
  async findSuppliersWithSupplierRoleUsers(page = 1, limit = 10, search = '', filters = {}) {
    const offset = (page - 1) * limit;

    const whereClause = {};

    // Add search functionality for supplier fields
    if (search) {
      whereClause[Op.or] = [
        { supplier_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { contact_person: { [Op.like]: `%${search}%` } }
      ];
    }

    if (filters.category) {
      whereClause.category = filters.category;
    }

    const { count, rows } = await db.Supplier.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.User,
        as: 'user',
        required: true, // INNER JOIN - only suppliers with linked users
        attributes: ['id', 'username', 'email', 'role_id'],
        include: [{
          model: db.Role,
          as: 'role',
          required: true,
          where: { name: 'supplier' }, // Only users with supplier role
          attributes: ['id', 'name']
        }]
      }],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    };
  }
}

export default new SupplierService();
