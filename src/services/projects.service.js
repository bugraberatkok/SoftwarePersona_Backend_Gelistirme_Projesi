const prisma = require('../config/db');

class ProjectsService {
  async createProject(teamId, data) {
    return prisma.project.create({
      data: { ...data, teamId },
    });
  }

  async getProjects(filters = {}) {
    const where = {};
    if (filters.teamId) where.teamId = filters.teamId;
    if (filters.status) where.status = filters.status;

    return prisma.project.findMany({
      where,
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectById(id) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        team: { select: { id: true, name: true } },
        _count: { select: { tasks: true } },
      },
    });
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }
    return project;
  }

  async updateProject(id, data) {
    await this.getProjectById(id);
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id) {
    await this.getProjectById(id);
    await prisma.project.delete({ where: { id } });
    return { message: 'Project deleted successfully' };
  }
}

module.exports = new ProjectsService();
