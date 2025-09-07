import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Employee extends Model {}

Employee.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    employee_id: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'departments',
            key: 'id',
        },
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'companies',
            key: 'id',
        },
    },
    position: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    hire_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'TERMINATED'),
        defaultValue: 'ACTIVE',
        allowNull: false,
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id',
        },
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['employee_id'] },
        { fields: ['email'] },
        { fields: ['department_id'] },
        { fields: ['company_id'] },
        { fields: ['manager_id'] },
        { fields: ['status'] },
    ],
});

export default Employee;
