const prisma = require('../config/db');
const { getXpReward } = require('../utils/gamification');

class TasksService {
  /**
   * Create a new task within a project.
   */
  async createTask(data) {
    // Verify project exists
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // If assignee is provided, verify they are a member of the project's team
    if (data.assigneeId) {
      const membership = await prisma.teamMember.findUnique({
        where: { teamId_userId: { teamId: project.teamId, userId: data.assigneeId } },
      });
      if (!membership) {
        const error = new Error('Assignee must be a member of the project team');
        error.statusCode = 400;
        throw error;
      }
    }

    return prisma.task.create({
      data,
      include: {
        assignee: { select: { id: true, username: true } },
        project: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Get tasks with filtering, search, sorting, and pagination.
   */
  async getTasks({ filters = {}, search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 }) {
    const where = {};
    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;

    // Search in title and description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Validate sortBy field
    const allowedSortFields = ['createdAt', 'updatedAt', 'priority', 'status', 'title'];
    const actualSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const actualOrder = order === 'asc' ? 'asc' : 'desc';

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          assignee: { select: { id: true, username: true } },
          project: { select: { id: true, name: true } },
        },
        orderBy: { [actualSortBy]: actualOrder },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single task by ID.
   */
  async getTaskById(id) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, username: true } },
        project: { select: { id: true, name: true, teamId: true } },
      },
    });
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return task;
  }

  /**
   * Update a task. Handles XP awarding when status changes to COMPLETED.
   */
  async updateTask(id, data) {
    const existingTask = await this.getTaskById(id);

    // Handle XP awarding when completing a task
    if (data.status === 'COMPLETED' && existingTask.status !== 'COMPLETED' && !existingTask.xpAwarded) {
      if (existingTask.assigneeId) {
        const xp = getXpReward(existingTask.priority);

        // Use a transaction to atomically update task + user XP
        const updatedTask = await prisma.$transaction(async (tx) => {
          // Award XP to the assignee
          await tx.user.update({
            where: { id: existingTask.assigneeId },
            data: { totalXp: { increment: xp } },
          });

          // Update the task with xpAwarded = true
          return tx.task.update({
            where: { id },
            data: { ...data, xpAwarded: true },
            include: {
              assignee: { select: { id: true, username: true, totalXp: true } },
              project: { select: { id: true, name: true } },
            },
          });
        });

        return { task: updatedTask, xpAwarded: xp };
      }
    }

    // Normal update (no XP logic)
    const updatedTask = await prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: { select: { id: true, username: true } },
        project: { select: { id: true, name: true } },
      },
    });

    return { task: updatedTask, xpAwarded: 0 };
  }

  /**
   * Delete a task.
   */
  async deleteTask(id) {
    await this.getTaskById(id);
    await prisma.task.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }
}

module.exports = new TasksService();
