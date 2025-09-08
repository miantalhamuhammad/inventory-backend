import jwt from 'jsonwebtoken';
import db from '../models/index.js';

// Main authentication middleware used throughout your routes
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Find user by ID from token - using decoded.userId to match your login controller
    const user = await db.User.findByPk(decoded.userId, {
      attributes: ['id', 'username', 'email', 'role_id', 'company_id', 'is_active'],
      include: [
        {
          model: db.Role,
          as: 'role',
          attributes: ['id', 'name']
        },
        {
          model: db.Company,
          as: 'company',
          attributes: ['id', 'name', 'is_active']
        }
      ]
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token or user not active.'
      });
    }

    // Check if user's company is active (if they have one)
    if (user.company_id && (!user.company || !user.company.is_active)) {
      return res.status(401).json({
        success: false,
        error: 'User company is not active.'
      });
    }

    req.user = user;
    req.companyId = user.company_id; // Add company_id to request for easy access
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }
};

// Permission-based authorization middleware (used in other routes)
export const requirePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    try {
      // Check if user has the required permission
      const userRole = await db.Role.findByPk(req.user.role_id, {
        include: [
          {
            model: db.Permission,
            as: 'permissions',
            where: { name: permission },
            required: false
          }
        ]
      });

      const hasPermission = userRole?.permissions?.length > 0;

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Insufficient permissions.'
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        error: 'Error checking permissions.'
      });
    }
  };
};
