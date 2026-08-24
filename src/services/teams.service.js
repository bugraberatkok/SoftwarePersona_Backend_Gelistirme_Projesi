const prisma = require('../config/db');

class TeamsService {
  /**
   * Create a new team and automatically add the creator as OWNER.
   */
  async createTeam(userId, { name, description }) {
    const team = await prisma.team.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, username: true, email: true } } },
        },
      },
    });
    return team;
  }

  /**
   * Get a team by ID with members
   */
  async getTeamById(teamId) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: { user: { select: { id: true, username: true, email: true, totalXp: true } } },
        },
        squads: true,
        _count: { select: { projects: true } },
      },
    });
    if (!team) {
      const error = new Error('Team not found');
      error.statusCode = 404;
      throw error;
    }
    return team;
  }

  /**
   * Get all teams for a user
   */
  async getUserTeams(userId) {
    const memberships = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            _count: { select: { members: true, projects: true } },
          },
        },
      },
    });
    return memberships.map((m) => ({
      ...m.team,
      role: m.role,
      joinedAt: m.joinedAt,
    }));
  }

  /**
   * Add a user to a team with a given role (default MEMBER).
   */
  async addMember(teamId, userId, role = 'MEMBER') {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if already a member
    const existing = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (existing) {
      const error = new Error('User is already a member of this team');
      error.statusCode = 409;
      throw error;
    }

    // Cannot add someone as OWNER
    if (role === 'OWNER') {
      const error = new Error('Cannot assign OWNER role. Each team has one owner.');
      error.statusCode = 400;
      throw error;
    }

    const member = await prisma.teamMember.create({
      data: { teamId, userId, role },
      include: { user: { select: { id: true, username: true, email: true } } },
    });
    return member;
  }

  /**
   * Remove a member from a team.
   */
  async removeMember(teamId, userId) {
    const member = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!member) {
      const error = new Error('User is not a member of this team');
      error.statusCode = 404;
      throw error;
    }
    if (member.role === 'OWNER') {
      const error = new Error('Cannot remove the team owner');
      error.statusCode = 400;
      throw error;
    }

    await prisma.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    });
    return { message: 'Member removed successfully' };
  }

  /**
   * Update a member's role
   */
  async updateMemberRole(teamId, userId, role) {
    const member = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!member) {
      const error = new Error('User is not a member of this team');
      error.statusCode = 404;
      throw error;
    }
    if (role === 'OWNER') {
      const error = new Error('Cannot assign OWNER role through this endpoint');
      error.statusCode = 400;
      throw error;
    }

    const updated = await prisma.teamMember.update({
      where: { teamId_userId: { teamId, userId } },
      data: { role },
      include: { user: { select: { id: true, username: true, email: true } } },
    });
    return updated;
  }

  /**
   * Delete a team (only owner can do this, cascades to everything)
   */
  async deleteTeam(teamId) {
    await prisma.team.delete({ where: { id: teamId } });
    return { message: 'Team deleted successfully' };
  }
}

module.exports = new TeamsService();
