const express = require('express');
const router = express.Router();
const squadsController = require('../controllers/squads.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createSquadSchema, addSquadMemberSchema } = require('../schemas');

// All squad routes require authentication
router.use(authenticate);

// GET /api/teams/:teamId/squads — List squads in a team (any team member)
// These are mounted under /api/teams/:teamId/squads in app.js
router.get('/', squadsController.getSquadsByTeam);

// POST /api/teams/:teamId/squads — Create a squad (OWNER, ADMIN)
router.post('/', validate(createSquadSchema), squadsController.createSquad);

// GET /api/squads/:id — Get squad details
router.get('/:id', squadsController.getSquad);

// POST /api/squads/:id/members — Add a member to a squad (OWNER, ADMIN of team)
router.post('/:id/members', validate(addSquadMemberSchema), squadsController.addMember);

// DELETE /api/squads/:id/members/:userId — Remove a member from a squad
router.delete('/:id/members/:userId', squadsController.removeMember);

// DELETE /api/squads/:id — Delete a squad
router.delete('/:id', squadsController.deleteSquad);

module.exports = router;
