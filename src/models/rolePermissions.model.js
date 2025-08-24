import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js';
import Role from './roles.model.js';
import Permission from './permissions.model.js';

class RolePermission extends Model {}

RolePermission.init({
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Role,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Permission,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'role_permissions',
    timestamps: false,
    indexes: [
        { fields: ['role_id'] },
        { fields: ['permission_id'] },
    ],
});

export default RolePermission;
