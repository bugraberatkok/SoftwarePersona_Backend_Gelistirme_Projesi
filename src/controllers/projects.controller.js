const projectsService = require('../services/projects.service');

const createProject = async (req, res, next) => {
  try {
    const project = await projectsService.createProject(req.params.teamId, req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.teamId) filters.teamId = req.query.teamId;
    if (req.query.status) filters.status = req.query.status;

    const projects = await projectsService.getProjects(filters);
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await projectsService.getProjectById(req.params.id);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectsService.updateProject(req.params.id, req.body);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const result = await projectsService.deleteProject(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };
