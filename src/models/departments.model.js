import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Department extends Model {}

Department.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    department_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    department_code: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id',
        },
    },
    budget: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Department',
    tableName: 'departments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['department_code'] },
        { fields: ['department_name'] },
        { fields: ['manager_id'] },
    ],
});

export default Department;
