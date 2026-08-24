const teamsService = require('../services/teams.service');
const leaderboardService = require('../services/leaderboard.service');

const createTeam = async (req, res, next) => {
  try {
    const team = await teamsService.createTeam(req.user.id, req.body);
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

const getTeam = async (req, res, next) => {
  try {
    const team = await teamsService.getTeamById(req.params.id);
    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

const getUserTeams = async (req, res, next) => {
  try {
    const teams = await teamsService.getUserTeams(req.user.id);
    res.json({ success: true, data: teams });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const member = await teamsService.addMember(req.params.id, req.body.userId, req.body.role);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const result = await teamsService.removeMember(req.params.id, req.params.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateMemberRole = async (req, res, next) => {
  try {
    const member = await teamsService.updateMemberRole(req.params.id, req.params.userId, req.body.role);
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    const result = await teamsService.deleteTeam(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await leaderboardService.getTeamLeaderboard(req.params.id);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeam,
  getUserTeams,
  addMember,
  removeMember,
  updateMemberRole,
  deleteTeam,
  getLeaderboard,
};
