const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createProjectSchema, updateProjectSchema } = require('../schemas');

// All project routes require authentication
router.use(authenticate);

// GET /api/projects?teamId=... — List projects (filtered by team)
router.get('/', projectsController.getProjects);

// POST /api/teams/:teamId/projects — Create project in a team (OWNER, ADMIN)
// This is mounted under /api/teams/:teamId/projects in app.js
router.post('/', validate(createProjectSchema), projectsController.createProject);

// GET /api/projects/:id — Get project details
router.get('/:id', projectsController.getProject);

// PATCH /api/projects/:id — Update project
router.patch('/:id', validate(updateProjectSchema), projectsController.updateProject);

// DELETE /api/projects/:id — Delete project
router.delete('/:id', projectsController.deleteProject);

module.exports = router;
