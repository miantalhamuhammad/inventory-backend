import { Warehouse, Employee } from '../models/index.js';

class WarehouseService {
    static async create(warehouseData) {
        try {
            const warehouse = await Warehouse.create(warehouseData);
            return warehouse.toJSON();
        } catch (error) {
            throw new Error(`Error creating warehouse: ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const warehouses = await Warehouse.findAll({
                include: [
                    {
                        model: Employee,
                        as: 'manager',
                        attributes: ['id', 'full_name'],
                        required: false
                    }
                ],
                order: [['created_at', 'DESC']]
            });
            return warehouses.map(warehouse => warehouse.toJSON());
        } catch (error) {
            throw new Error(`Error fetching warehouses: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const warehouse = await Warehouse.findByPk(id, {
                include: [
                    {
                        model: Employee,
                        as: 'manager',
                        attributes: ['id', 'full_name'],
                        required: false
                    }
                ]
            });
            return warehouse ? warehouse.toJSON() : null;
        } catch (error) {
            throw new Error(`Error fetching warehouse: ${error.message}`);
        }
    }

    static async update(id, warehouseData) {
        try {
            const [updatedRowsCount] = await Warehouse.update(warehouseData, {
                where: { id }
            });

            if (updatedRowsCount === 0) {
                return null;
            }

            return await this.findById(id);
        } catch (error) {
            throw new Error(`Error updating warehouse: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const deletedRowsCount = await Warehouse.destroy({
                where: { id }
            });
            return deletedRowsCount > 0;
        } catch (error) {
            throw new Error(`Error deleting warehouse: ${error.message}`);
        }
    }
}

export default WarehouseService;
