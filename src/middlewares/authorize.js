const prisma = require('../config/db');

/**
 * Authorization Middleware Factory
 * Checks that the authenticated user is a member of the team
 * and has one of the required roles.
 *
 * Usage: authorize('OWNER', 'ADMIN') — allows only owners and admins.
 * Usage: authorize() — allows any team member.
 *
 * Expects teamId from:
 *   - req.params.teamId
 *   - req.params.id (for /teams/:id routes)
 *   - req.body.teamId
 *
 * Sets req.teamMember with { teamId, userId, role }
 */
const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const teamId = req.params.teamId || req.params.id || req.body.teamId;

      if (!teamId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Team ID is required for this operation.' },
        });
      }

      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: req.user.id,
          },
        },
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          error: { message: 'You are not a member of this team.' },
        });
      }

      // If specific roles are required, check them
      if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          success: false,
          error: { message: `Insufficient permissions. Required role: ${allowedRoles.join(' or ')}.` },
        });
      }

      req.teamMember = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorize;
