import UserService from '../services/userService.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

class AuthController {
    // POST /api/auth/register
    static async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { username, email, password_hash: passwordHash, role_id: roleId, company_id: companyId } = req.body;

            // Check if user already exists
            const existingUser = await UserService.findByEmail(email);
            if (existingUser) {
                return res.error('User already exists with this email', 400);
            }

            // Validate company exists if company_id is provided
            if (companyId) {
                const CompanyService = await import('../services/companyService.js').then(m => m.default);
                const company = await CompanyService.findById(companyId);
                if (!company) {
                    return res.error('Company not found', 400);
                }
                if (!company.is_active) {
                    return res.error('Company is not active', 400);
                }
            }

            const userData = { username, email, password_hash: passwordHash, role_id: roleId, company_id: companyId };
            const user = await UserService.create(userData);

            // Remove password from response
            delete user.password_hash;

            res.success(user, 'User registered successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/auth/login
    static async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const { email, password } = req.body;

            const user = await UserService.findByEmail(email);
            if (!user) {
                return res.error('Invalid credentials', 401);
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.error('Invalid credentials', 401);
            }

            if (!user.is_active) {
                return res.error('Account is deactivated', 401);
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.role?.name,
                },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '24h' },
            );

            // Remove password from response
            const userResponse = { ...user.toJSON() };
            delete userResponse.password_hash;

            res.success({
                user: userResponse,
                token,
                expiresIn: '24h',
            }, 'Login successful');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/auth/logout
    static async logout(req, res, next) {
        try {
            // In a real implementation, you might blacklist the token
            res.success(null, 'Logout successful');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/auth/profile
    static async getProfile(req, res, next) {
        try {
            const user = await UserService.findById(req.user.userId);
            if (!user) {
                return res.error('User not found', 404);
            }

            // Remove password from response
            const userResponse = { ...user.toJSON() };
            delete userResponse.password_hash;

            res.success(userResponse, 'Profile retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/auth/profile
    static async updateProfile(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.error('Validation failed', 400, errors.array());
            }

            const updated = await UserService.update(req.user.userId, req.body);
            if (!updated) {
                return res.error('Failed to update profile', 400);
            }

            res.success(null, 'Profile updated successfully');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/auth/forgot-password
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;

            const user = await UserService.findByEmail(email);
            if (!user) {
                // Don't reveal if email exists
                return res.success(null, 'If email exists, reset instructions have been sent');
            }

            // In a real implementation, you would send a reset email
            // For now, just return success
            res.success(null, 'Password reset instructions sent to email');
        } catch (error) {
            next(error);
        }
    }

    // POST /api/auth/reset-password
    static async resetPassword(req, res, next) {
        try {
            const { token: _token, newPassword: _newPassword } = req.body;

            // In a real implementation, you would verify the reset token
            // and update the user's password
            res.success(null, 'Password reset successful');
        } catch (error) {
            next(error);
        }
    }

    // GET /api/auth/verify-token
    static async verifyToken(req, res, next) {
        try {
            // If we reach here, the token is valid (verified by middleware)
            res.success({ valid: true }, 'Token is valid');
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
