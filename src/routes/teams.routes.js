const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teams.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createTeamSchema, addTeamMemberSchema } = require('../schemas');

// All team routes require authentication
router.use(authenticate);

// GET /api/teams — Get all teams for the current user
router.get('/', teamsController.getUserTeams);

// POST /api/teams — Create a new team (creator becomes OWNER)
router.post('/', validate(createTeamSchema), teamsController.createTeam);

// GET /api/teams/:id — Get team details (any team member)
router.get('/:id', authorize(), teamsController.getTeam);

// DELETE /api/teams/:id — Delete the team (OWNER only)
router.delete('/:id', authorize('OWNER'), teamsController.deleteTeam);

// POST /api/teams/:id/members — Add a user to the team (OWNER, ADMIN)
router.post('/:id/members', authorize('OWNER', 'ADMIN'), validate(addTeamMemberSchema), teamsController.addMember);

// PATCH /api/teams/:id/members/:userId — Update a member's role (OWNER, ADMIN)
router.patch('/:id/members/:userId', authorize('OWNER', 'ADMIN'), teamsController.updateMemberRole);

// DELETE /api/teams/:id/members/:userId — Remove a member (OWNER, ADMIN)
router.delete('/:id/members/:userId', authorize('OWNER', 'ADMIN'), teamsController.removeMember);

// GET /api/teams/:id/leaderboard — Team XP leaderboard (any team member)
router.get('/:id/leaderboard', authorize(), teamsController.getLeaderboard);

module.exports = router;
