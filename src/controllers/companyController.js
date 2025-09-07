import CompanyService from '../services/companyService.js';
import { validationResult } from 'express-validator';

class CompanyController {
    // POST /api/companies
  static async addNewCompany(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.error('Validation failed', 400, errors.array());
      }

      const { name, address, phone, email, website, adminUserData } = req.body;

      // Check if company already exists with the same name
      const existingCompany = await CompanyService.findByName(name);
      if (existingCompany) {
        return res.error('Company already exists with this name', 400);
      }

      const companyData = {
        name,
        address,
        phone,
        email,
        website,
        is_active: true
      };

      // ✅ Pass adminUserData to service
      const result = await CompanyService.create(companyData, adminUserData);

      res.success(result, 'Company created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

    // GET /api/companies/:id
    static async getCompanyById(req, res, next) {
        try {
            const { id } = req.params;
            const company = await CompanyService.findById(id);

            if (!company) {
                return res.error('Company not found', 404);
            }

            res.success(company, 'Company retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/companies
    static async getAllCompanies(req, res, next) {
        try {
            const companies = await CompanyService.findAll();
            res.success(companies, 'Companies retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/companies/:id
    static async updateCompany(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const updateData = req.body;

            // If name is being updated, check for uniqueness
            if (updateData.name) {
                const existingCompany = await CompanyService.findByName(updateData.name);
                if (existingCompany && existingCompany.id !== parseInt(id)) {
                    return res.error('Company already exists with this name', 400);
                }
            }

            const company = await CompanyService.update(id, updateData);

            if (!company) {
                return res.error('Company not found or update failed', 404);
            }

            res.success(company, 'Company updated successfully');
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/companies/:id
    static async deleteCompany(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await CompanyService.delete(id);

            if (!deleted) {
                return res.error('Company not found', 404);
            }

            res.success(null, 'Company deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/companies/:id/deactivate
    static async deactivateCompany(req, res, next) {
        try {
            const { id } = req.params;
            const company = await CompanyService.deactivate(id);

            if (!company) {
                return res.error('Company not found', 404);
            }

            res.success(company, 'Company deactivated successfully');
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/companies/:id/activate
    static async activateCompany(req, res, next) {
        try {
            const { id } = req.params;
            const company = await CompanyService.activate(id);

            if (!company) {
                return res.error('Company not found', 404);
            }

            res.success(company, 'Company activated successfully');
        } catch (error) {
            next(error);
        }
    }
}

export default CompanyController;
