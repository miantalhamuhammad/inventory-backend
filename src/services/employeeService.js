import pool from '../config/dbconfig.js';

class EmployeeService {
    static async create(employeeData) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                `INSERT INTO employees (
                    employee_id, full_name, email, phone_number, address, department_id,
                    position, hire_date, salary, status, manager_id, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    employeeData.employee_id, employeeData.full_name, employeeData.email,
                    employeeData.phone_number, employeeData.address, employeeData.department_id,
                    employeeData.position, employeeData.hire_date, employeeData.salary,
                    employeeData.status || 'ACTIVE', employeeData.manager_id, employeeData.notes,
                ],
            );

            return { id: result.insertId, ...employeeData };
        } finally {
            connection.release();
        }
    }

    static async findAll(page = 1, limit = 10, search = '', filters = {}) {
        const connection = await pool.getConnection();
        try {
            const offset = (page - 1) * limit;
            let whereClause = 'WHERE 1=1';
            const params = [];

            if (search) {
                whereClause += ' AND (e.full_name LIKE ? OR e.employee_id LIKE ? OR e.email LIKE ?)';
                params.push(`%${search}%`, `%${search}%`, `%${search}%`);
            }

            if (filters.department_id) {
                whereClause += ' AND e.department_id = ?';
                params.push(filters.department_id);
            }

            if (filters.status) {
                whereClause += ' AND e.status = ?';
                params.push(filters.status);
            }

            const [rows] = await connection.execute(
                `SELECT e.*, d.department_name, m.full_name as manager_name 
                 FROM employees e
                 LEFT JOIN departments d ON e.department_id = d.id
                 LEFT JOIN employees m ON e.manager_id = m.id
                 ${whereClause} ORDER BY e.created_at DESC LIMIT ? OFFSET ?`,
                [...params, limit, offset],
            );

            const [countResult] = await connection.execute(
                `SELECT COUNT(*) as total FROM employees e ${whereClause}`,
                params,
            );

            return {
                data: rows,
                pagination: {
                    page,
                    limit,
                    total: countResult[0].total,
                    pages: Math.ceil(countResult[0].total / limit),
                },
            };
        } finally {
            connection.release();
        }
    }

    static async findById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT e.*, d.department_name, m.full_name as manager_name 
                FROM employees e
                LEFT JOIN departments d ON e.department_id = d.id
                LEFT JOIN employees m ON e.manager_id = m.id
                WHERE e.id = ?
            `, [id]);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async update(id, employeeData) {
        const connection = await pool.getConnection();
        try {
            const fields = Object.keys(employeeData).filter(key => employeeData[key] !== undefined);
            const values = fields.map(field => employeeData[field]);
            const setClause = fields.map(field => `${field} = ?`).join(', ');

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            const [result] = await connection.execute(
                `UPDATE employees SET ${setClause} WHERE id = ?`,
                [...values, id],
            );

            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('DELETE FROM employees WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    static async bulkCreate(employeesData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const results = [];
            for (const employeeData of employeesData) {
                const [result] = await connection.execute(
                    `INSERT INTO employees (
                        employee_id, full_name, email, phone_number, address, department_id,
                        position, hire_date, salary, status, manager_id, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        employeeData.employee_id, employeeData.full_name, employeeData.email,
                        employeeData.phone_number, employeeData.address, employeeData.department_id,
                        employeeData.position, employeeData.hire_date, employeeData.salary,
                        employeeData.status || 'ACTIVE', employeeData.manager_id, employeeData.notes,
                    ],
                );
                results.push({ id: result.insertId, ...employeeData });
            }

            await connection.commit();
            return results;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default EmployeeService;
