const prisma = require('../config/db');

class SquadsService {
  async createSquad(teamId, { name }) {
    return prisma.squad.create({
      data: { name, teamId },
    });
  }

  async getSquadsByTeam(teamId) {
    return prisma.squad.findMany({
      where: { teamId },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSquadById(id) {
    const squad = await prisma.squad.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, username: true, email: true, totalXp: true } } },
        },
        team: { select: { id: true, name: true } },
      },
    });
    if (!squad) {
      const error = new Error('Squad not found');
      error.statusCode = 404;
      throw error;
    }
    return squad;
  }

  async addMember(squadId, userId) {
    // Verify squad exists and get team info
    const squad = await this.getSquadById(squadId);

    // Verify user is a member of the squad's team
    const teamMember = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: squad.teamId, userId } },
    });
    if (!teamMember) {
      const error = new Error('User must be a member of the team to join a squad');
      error.statusCode = 400;
      throw error;
    }

    // Check if already in squad
    const existing = await prisma.squadMember.findUnique({
      where: { squadId_userId: { squadId, userId } },
    });
    if (existing) {
      const error = new Error('User is already a member of this squad');
      error.statusCode = 409;
      throw error;
    }

    return prisma.squadMember.create({
      data: { squadId, userId },
      include: { user: { select: { id: true, username: true, email: true } } },
    });
  }

  async removeMember(squadId, userId) {
    const member = await prisma.squadMember.findUnique({
      where: { squadId_userId: { squadId, userId } },
    });
    if (!member) {
      const error = new Error('User is not a member of this squad');
      error.statusCode = 404;
      throw error;
    }

    await prisma.squadMember.delete({
      where: { squadId_userId: { squadId, userId } },
    });
    return { message: 'Member removed from squad' };
  }

  async deleteSquad(id) {
    await this.getSquadById(id);
    await prisma.squad.delete({ where: { id } });
    return { message: 'Squad deleted successfully' };
  }
}

module.exports = new SquadsService();
