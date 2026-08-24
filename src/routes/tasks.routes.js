const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { createTaskSchema, updateTaskSchema } = require('../schemas');

// All task routes require authentication
router.use(authenticate);

// POST /api/tasks — Create a new task
router.post('/', validate(createTaskSchema), tasksController.createTask);

// GET /api/tasks?projectId=...&status=...&priority=...&search=...&sortBy=...&order=...&page=...&limit=...
router.get('/', tasksController.getTasks);

// GET /api/tasks/:id — Get task details
router.get('/:id', tasksController.getTaskById);

// PATCH /api/tasks/:id — Update task (status, priority, assignee, etc.)
router.patch('/:id', validate(updateTaskSchema), tasksController.updateTask);

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
