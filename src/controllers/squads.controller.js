const squadsService = require('../services/squads.service');

const createSquad = async (req, res, next) => {
  try {
    const squad = await squadsService.createSquad(req.params.teamId, req.body);
    res.status(201).json({ success: true, data: squad });
  } catch (error) {
    next(error);
  }
};

const getSquadsByTeam = async (req, res, next) => {
  try {
    const squads = await squadsService.getSquadsByTeam(req.params.teamId);
    res.json({ success: true, data: squads });
  } catch (error) {
    next(error);
  }
};

const getSquad = async (req, res, next) => {
  try {
    const squad = await squadsService.getSquadById(req.params.id);
    res.json({ success: true, data: squad });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const member = await squadsService.addMember(req.params.id, req.body.userId);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const result = await squadsService.removeMember(req.params.id, req.params.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const deleteSquad = async (req, res, next) => {
  try {
    const result = await squadsService.deleteSquad(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSquad, getSquadsByTeam, getSquad, addMember, removeMember, deleteSquad };
