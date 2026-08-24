const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const { registerSchema, loginSchema } = require('../schemas');

// POST /api/auth/register — Create a new user account
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login — Authenticate and receive a JWT
router.post('/login', validate(loginSchema), authController.login);

// GET /api/auth/profile — Get the currently authenticated user's profile
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
