const prisma = require('../config/db');
const { calculateLevel } = require('../utils/gamification');

class LeaderboardService {
  /**
   * Get team leaderboard — members ranked by XP
   */
  async getTeamLeaderboard(teamId) {
    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: { id: true, username: true, totalXp: true },
        },
      },
      orderBy: {
        user: { totalXp: 'desc' },
      },
    });

    return members.map((m, index) => ({
      rank: index + 1,
      userId: m.user.id,
      username: m.user.username,
      totalXp: m.user.totalXp,
      level: calculateLevel(m.user.totalXp),
    }));
  }
}

module.exports = new LeaderboardService();
