import Company from '../models/company.model.js';
import User from '../models/user.model.js';
import Role from '../models/roles.model.js';
import EmailService from './emailService.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

class CompanyService {
    // static async create(companyData, adminUserData = {}) {
    //     try {
    //         // Store the plain password for email before hashing
    //         const plainPassword = adminUserData.password || 'Admin123!';
    //
    //         // Start a transaction to ensure both company and admin user are created together
    //         const result = await Company.sequelize.transaction(async (transaction) => {
    //             // Create the company first
    //             const company = await Company.create(companyData, { transaction });
    //
    //             // Get the Admin role
    //           const adminRole = await Role.findOne({
    //             where: {
    //               name: {
    //                 [Op.like]: '%admin%'
    //               }
    //             },
    //             transaction
    //           });
    //
    //
    //             if (!adminRole) {
    //                 throw new Error('Admin role not found. Please ensure roles are properly seeded.');
    //             }
    //
    //             // Prepare admin user data with defaults
    //             const defaultAdminData = {
    //                 username: `admin_${company.name.toLowerCase().replace(/\s+/g, '_')}`,
    //                 email: adminUserData.email || `admin@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
    //                 password_hash: plainPassword,
    //                 role_id: adminRole.id,
    //                 company_id: company.id,
    //                 is_active: true
    //             };
    //
    //             // Override with any provided admin user data
    //             const finalAdminData = { ...defaultAdminData, ...adminUserData };
    //
    //             // Hash the password if it's not already hashed
    //           //  if (finalAdminData.password_hash && !finalAdminData.password_hash.startsWith('$2b$')) {
    //                 const saltRounds = 10;
    //                 finalAdminData.password_hash = await bcrypt.hash(finalAdminData.password_hash, saltRounds);
    //          //   }
    //
    //             // Create the admin user
    //             const adminUser = await User.create(finalAdminData, { transaction });
    //
    //             // Return company with the created admin user info
    //             return {
    //                 company,
    //                 adminUser: {
    //                     id: adminUser.id,
    //                     username: adminUser.username,
    //                     email: adminUser.email,
    //                     role_id: adminUser.role_id,
    //                     company_id: adminUser.company_id,
    //                     is_active: adminUser.is_active
    //                 }
    //             };
    //         });
    //
    //         console.log(`✅ Company "${result.company.name}" created with admin user "${result.adminUser.username}"`);
    //
    //         // Send welcome email to the admin user (non-blocking)
    //         this.sendWelcomeEmail(result.company, result.adminUser, plainPassword)
    //             .catch(error => {
    //                 console.error('❌ Failed to send welcome email, but company creation was successful:', error.message);
    //             });
    //
    //         return result;
    //     } catch (error) {
    //         console.error('❌ Error creating company with admin user:', error.message);
    //         throw error;
    //     }
    // }
  static async create(companyData, adminUserData = {}) {
    try {
      const plainPassword = adminUserData.password || 'Admin123!';

      const result = await Company.sequelize.transaction(async (transaction) => {
        const company = await Company.create(companyData, { transaction });

        const adminRole = await Role.findOne({
          where: { name: { [Op.like]: '%admin%' } },
          transaction
        });

        if (!adminRole) {
          throw new Error('Admin role not found. Please seed roles first.');
        }

        const defaultAdminData = {
          username: `admin_${company.name.toLowerCase().replace(/\s+/g, '_')}`,
          email: adminUserData.email || `admin@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
          role_id: adminRole.id,
          company_id: company.id,
          is_active: true
        };

        // Merge optional fields (like username override)
        const finalAdminData = { ...defaultAdminData, ...adminUserData };

        // Always hash password into password_hash
        finalAdminData.password_hash = adminUserData.password;

        const adminUser = await User.create(finalAdminData, { transaction });

        return {
          company,
          adminUser: {
            id: adminUser.id,
            username: adminUser.username,
            email: adminUser.email,
            role_id: adminUser.role_id,
            company_id: adminUser.company_id,
            is_active: adminUser.is_active
          }
        };
      });

      console.log(`✅ Company "${result.company.name}" created with admin user "${result.adminUser.username}"`);

      // Send plain password in welcome email
      this.sendWelcomeEmail(result.company, result.adminUser, plainPassword)
        .catch(err => console.error('❌ Failed to send welcome email:', err.message));

      return result;
    } catch (error) {
      console.error('❌ Error creating company with admin user:', error.message);
      throw error;
    }
  }

    // Send welcome email with admin credentials
    static async sendWelcomeEmail(companyData, adminUserData, plainPassword) {
        try {
            const emailService = new EmailService();

            // Test email connection first
            const connectionTest = await emailService.testConnection();
            if (!connectionTest) {
                throw new Error('Email service is not configured properly. Please check your email settings.');
            }

            // Send the welcome email
            const emailResult = await emailService.sendCompanyWelcomeEmail(
                companyData,
                adminUserData,
                plainPassword
            );

            if (emailResult.success) {
                console.log(`📧 Welcome email sent successfully to ${adminUserData.email}`);
                console.log(`📋 Admin credentials delivered for company: ${companyData.name}`);
                return emailResult;
            } else {
                throw new Error(emailResult.error);
            }
        } catch (error) {
            console.error('❌ Email sending failed:', error.message);
            throw error;
        }
    }
  static async findByName(name) {
    try {
      const company = await Company.findOne({
        where: { name }
      });

      return company;
    } catch (error) {
      throw error;
    }
  }

    static async findById(id) {
        try {
            const company = await Company.findByPk(id, {
                include: [{
                    association: 'users',
                    attributes: ['id', 'username', 'email', 'is_active', 'role_id'],
                    include: [{
                        model: Role,
                        as: 'role',
                        attributes: ['id', 'name', 'description']
                    }]
                }]
            });
            return company;
        } catch (error) {
            throw error;
        }
    }

    static async findAll(options = {}) {
        try {
            const companies = await Company.findAll({
                include: [{
                    association: 'users',
                    attributes: ['id', 'username', 'email', 'is_active', 'role_id'],
                    include: [{
                        model: Role,
                        as: 'role',
                        attributes: ['id', 'name']
                    }]
                }],
                order: [['created_at', 'DESC']],
                ...options
            });
            return companies;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const [updatedRowsCount] = await Company.update(updateData, {
                where: { id }
            });

            if (updatedRowsCount === 0) {
                throw new Error('Company not found');
            }

            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            // Note: This will also cascade delete related users due to foreign key constraints
            const deletedRowsCount = await Company.destroy({
                where: { id }
            });

            if (deletedRowsCount === 0) {
                throw new Error('Company not found');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    static async activate(id) {
        try {
            return await this.update(id, { is_active: true });
        } catch (error) {
            throw error;
        }
    }

    static async deactivate(id) {
        try {
            return await this.update(id, { is_active: false });
        } catch (error) {
            throw error;
        }
    }

    static async getCompanyUsers(companyId, options = {}) {
        try {
            const users = await User.findAll({
                where: { company_id: companyId },
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name', 'description']
                }],
                attributes: { exclude: ['password_hash'] },
                order: [['created_at', 'DESC']],
                ...options
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    static async getCompanyStats(companyId) {
        try {
            const company = await Company.findByPk(companyId);
            if (!company) {
                throw new Error('Company not found');
            }

            // Get count of users by role for this company
            const userStats = await User.findAll({
                where: { company_id: companyId },
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['name']
                }],
                attributes: ['role_id'],
                raw: true
            });

            const roleStats = userStats.reduce((acc, user) => {
                const roleName = user['role.name'] || 'No Role';
                acc[roleName] = (acc[roleName] || 0) + 1;
                return acc;
            }, {});

            return {
                company,
                totalUsers: userStats.length,
                usersByRole: roleStats,
                isActive: company.is_active
            };
        } catch (error) {
            throw error;
        }
    }
}

export default CompanyService;
