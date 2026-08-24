const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const authenticate = require('./middlewares/authenticate');
const authorize = require('./middlewares/authorize');

const app = express();

// ─── Global Middlewares ───
app.use(cors());
app.use(express.json());
app.use(logger);

// ─── Routes ───

// Auth (public)
app.use('/api/auth', require('./routes/auth.routes'));

// Tasks (authenticated)
app.use('/api/tasks', require('./routes/tasks.routes'));

// Teams (authenticated, authorization handled per-route)
app.use('/api/teams', require('./routes/teams.routes'));

// Team-scoped project creation: POST /api/teams/:teamId/projects
app.post(
  '/api/teams/:teamId/projects',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  require('./controllers/projects.controller').createProject
);

// Team-scoped squad routes: GET & POST /api/teams/:teamId/squads
app.get(
  '/api/teams/:teamId/squads',
  authenticate,
  authorize(),
  require('./controllers/squads.controller').getSquadsByTeam
);
app.post(
  '/api/teams/:teamId/squads',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  require('./controllers/squads.controller').createSquad
);

// Projects (authenticated, flat routes for get/update/delete)
app.use('/api/projects', require('./routes/projects.routes'));

// Squads (authenticated, flat routes for get/member/delete)
app.use('/api/squads', require('./routes/squads.routes'));

// ─── 404 Handler ───
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' },
  });
});

// ─── Global Error Handler ───
app.use(errorHandler);

module.exports = app;
