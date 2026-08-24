const authService = require('../services/auth.service');
const { calculateLevel } = require('../utils/gamification');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({
      success: true,
      data: {
        ...user,
        level: calculateLevel(user.totalXp),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };
