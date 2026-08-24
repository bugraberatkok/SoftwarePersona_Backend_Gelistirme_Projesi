const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async register({ username, email, password }) {
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      const error = new Error('Username is already taken');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, passwordHash },
      select: { id: true, username: true, email: true, totalXp: true, createdAt: true },
    });

    const token = generateToken(user.id);

    return { user, token };
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        totalXp: user.totalXp,
      },
      token,
    };
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        totalXp: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new AuthService();
