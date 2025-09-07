import Company from './company.model.js';
import User from './user.model.js';
import Employee from './employees.model.js';
import Department from './departments.model.js';
import Supplier from './suppliers.model.js';
import Customer from './customers.model.js';
import Product from './products.model.js';
import Category from './categories.model.js';
import Warehouse from './warehouses.model.js';

// Company associations
Company.hasMany(User, { foreignKey: 'company_id', as: 'users' });
User.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(Employee, { foreignKey: 'company_id', as: 'employees' });
Employee.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(Department, { foreignKey: 'company_id', as: 'departments' });
Department.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(Supplier, { foreignKey: 'company_id', as: 'suppliers' });
Supplier.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(Customer, { foreignKey: 'company_id', as: 'customers' });
Customer.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(Product, { foreignKey: 'company_id', as: 'products' });
Product.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(Category, { foreignKey: 'company_id', as: 'categories' });
Category.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(Warehouse, { foreignKey: 'company_id', as: 'warehouses' });
Warehouse.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Other existing associations...
Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Employee, { foreignKey: 'department_id', as: 'employees' });

Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

Product.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
Supplier.hasMany(Product, { foreignKey: 'supplier_id', as: 'products' });

Warehouse.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });
Employee.hasMany(Warehouse, { foreignKey: 'manager_id', as: 'managedWarehouses' });

Department.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });
Employee.hasMany(Department, { foreignKey: 'manager_id', as: 'managedDepartments' });

export {
  Company,
  User,
  Employee,
  Department,
  Supplier,
  Customer,
  Product,
  Category,
  Warehouse
};
