const tasksService = require('../services/tasks.service');

const createTask = async (req, res, next) => {
  try {
    const task = await tasksService.createTask(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.projectId) filters.projectId = req.query.projectId;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.assigneeId) filters.assigneeId = req.query.assigneeId;

    const search = req.query.search || undefined;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'desc';
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100

    const result = await tasksService.getTasks({ filters, search, sortBy, order, page, limit });
    res.json({ success: true, data: result.tasks, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await tasksService.getTaskById(req.params.id);
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { task, xpAwarded } = await tasksService.updateTask(req.params.id, req.body);
    const response = { success: true, data: task };
    if (xpAwarded > 0) {
      response.meta = { xpAwarded, message: `+${xpAwarded} XP awarded!` };
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const result = await tasksService.deleteTask(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
