const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/db');

/**
 * Authentication Middleware
 * Extracts and verifies JWT from Authorization header.
 * Attaches req.user = { id, username, email, totalXp }
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied. No token provided.' },
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true, totalXp: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token. User not found.' },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token.' },
    });
  }
};

module.exports = authenticate;
