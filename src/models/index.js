import sequelize from '../config/dbconfig.js';

// Import all existing models
import User from './user.model.js';
import Role from './roles.model.js';
import Permission from './permissions.model.js';
import RolePermission from './rolePermissions.model.js';
import Product from './products.model.js';
import Category from './categories.model.js';
import Supplier from './suppliers.model.js';
import Customer from './customers.model.js';
import Warehouse from './warehouses.model.js';
import Stock from './stock.model.js';
import StockMovement from './stockMovements.model.js';
import PurchaseOrder from './purchaseOrders.model.js';
import PurchaseOrderItem from './purchaseOrderItems.model.js';
import SupplierQuotation from './supplierQuotations.model.js';
import SupplierQuotationItem from './supplierQuotationItems.model.js';
import SaleOrder from './saleOrders.model.js';
import SaleOrderItem from './saleOrderItems.model.js';
import Employee from './employees.model.js';
import Department from './departments.model.js';
import Invoice from './invoices.model.js';
import Shipment from './shipments.model.js';

// Define associations
const defineAssociations = () => {
    // User associations
    Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
    User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

    // Role and Permission associations (Many-to-Many)
    Role.belongsToMany(Permission, {
        through: RolePermission,
        foreignKey: 'role_id',
        otherKey: 'permission_id',
        as: 'permissions'
    });
    Permission.belongsToMany(Role, {
        through: RolePermission,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as: 'roles'
    });

    // Product associations
    Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
    Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

    Supplier.hasMany(Product, { foreignKey: 'supplier_id', as: 'products' });
    Product.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

    // Category self-referencing
    Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
    Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

    // Stock associations
    Product.hasMany(Stock, { foreignKey: 'product_id', as: 'stock' });
    Stock.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    Warehouse.hasMany(Stock, { foreignKey: 'warehouse_id', as: 'stock' });
    Stock.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

    // Stock Movement associations
    Product.hasMany(StockMovement, { foreignKey: 'product_id', as: 'movements' });
    StockMovement.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    Warehouse.hasMany(StockMovement, { foreignKey: 'warehouse_id', as: 'movements' });
    StockMovement.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

    User.hasMany(StockMovement, { foreignKey: 'created_by', as: 'stockMovements' });
    StockMovement.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

    // Purchase Order associations
    Supplier.hasMany(PurchaseOrder, { foreignKey: 'supplier_id', as: 'purchaseOrders' });
    PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

    Warehouse.hasMany(PurchaseOrder, { foreignKey: 'warehouse_id', as: 'purchaseOrders' });
    PurchaseOrder.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

    User.hasMany(PurchaseOrder, { foreignKey: 'created_by', as: 'purchaseOrders' });
    PurchaseOrder.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

    // Purchase Order Items
    PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'purchase_order_id', as: 'items' });
    PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'purchase_order_id', as: 'purchaseOrder' });

    Product.hasMany(PurchaseOrderItem, { foreignKey: 'product_id', as: 'purchaseOrderItems' });
    PurchaseOrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    // Supplier Quotation associations
    PurchaseOrder.hasMany(SupplierQuotation, { foreignKey: 'purchase_order_id', as: 'quotations' });
    SupplierQuotation.belongsTo(PurchaseOrder, { foreignKey: 'purchase_order_id', as: 'purchaseOrder' });

    Supplier.hasMany(SupplierQuotation, { foreignKey: 'supplier_id', as: 'quotations' });
    SupplierQuotation.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

    User.hasMany(SupplierQuotation, { foreignKey: 'reviewed_by', as: 'reviewedQuotations' });
    SupplierQuotation.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

    // Supplier Quotation Items
    SupplierQuotation.hasMany(SupplierQuotationItem, { foreignKey: 'quotation_id', as: 'items' });
    SupplierQuotationItem.belongsTo(SupplierQuotation, { foreignKey: 'quotation_id', as: 'quotation' });

    Product.hasMany(SupplierQuotationItem, { foreignKey: 'product_id', as: 'supplierQuotationItems' });
    SupplierQuotationItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    // Sale Order associations
    Customer.hasMany(SaleOrder, { foreignKey: 'customer_id', as: 'saleOrders' });
    SaleOrder.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

    Warehouse.hasMany(SaleOrder, { foreignKey: 'warehouse_id', as: 'saleOrders' });
    SaleOrder.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

    User.hasMany(SaleOrder, { foreignKey: 'created_by', as: 'saleOrders' });
    SaleOrder.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

    // Sale Order Items
    SaleOrder.hasMany(SaleOrderItem, { foreignKey: 'sale_order_id', as: 'items' });
    SaleOrderItem.belongsTo(SaleOrder, { foreignKey: 'sale_order_id', as: 'saleOrder' });

    Product.hasMany(SaleOrderItem, { foreignKey: 'product_id', as: 'saleOrderItems' });
    SaleOrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    // Employee and Department associations
    Department.hasMany(Employee, { foreignKey: 'department_id', as: 'employees' });
    Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

    Employee.hasMany(Employee, { foreignKey: 'manager_id', as: 'subordinates' });
    Employee.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });

    Employee.hasMany(Department, { foreignKey: 'manager_id', as: 'managedDepartments' });
    Department.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });

    // Warehouse manager
    Employee.hasMany(Warehouse, { foreignKey: 'manager_id', as: 'managedWarehouses' });
    Warehouse.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });

    // Invoice associations
    Customer.hasMany(Invoice, { foreignKey: 'customer_id', as: 'invoices' });
    Invoice.belongsTo(Customer, { foreignKey: 'customer_id', as: 'invoiceCustomer' });

    SaleOrder.hasMany(Invoice, { foreignKey: 'sale_order_id', as: 'invoices' });
    Invoice.belongsTo(SaleOrder, { foreignKey: 'sale_order_id', as: 'saleOrder' });

    User.hasMany(Invoice, { foreignKey: 'created_by', as: 'invoices' });
    Invoice.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

    // Shipment associations
    Shipment.belongsTo(SaleOrder, { foreignKey: 'sale_order_id', as: 'saleOrder' });
    SaleOrder.hasMany(Shipment, { foreignKey: 'sale_order_id', as: 'shipments' });
};

// Initialize associations
defineAssociations();

// Export all models
export {
    sequelize,
    User,
    Role,
    Permission,
    RolePermission,
    Product,
    Category,
    Supplier,
    Customer,
    Warehouse,
    Stock,
    StockMovement,
    PurchaseOrder,
    PurchaseOrderItem,
    SupplierQuotation,
    SupplierQuotationItem,
    SaleOrder,
    SaleOrderItem,
    Employee,
    Department,
    Invoice,
    Shipment
};

// Default export
export default {
    sequelize,
    User,
    Role,
    Permission,
    RolePermission,
    Product,
    Category,
    Supplier,
    Customer,
    Warehouse,
    Stock,
    StockMovement,
    PurchaseOrder,
    PurchaseOrderItem,
    SupplierQuotation,
    SupplierQuotationItem,
    SaleOrder,
    SaleOrderItem,
    Employee,
    Department,
    Invoice,
    Shipment
};
