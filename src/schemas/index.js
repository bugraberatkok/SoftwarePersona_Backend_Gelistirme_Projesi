const { z } = require('zod');

// ─── Task Schemas ───

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(2000).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
    assigneeId: z.string().uuid('Invalid assignee ID').optional().nullable(),
    projectId: z.string().uuid('Invalid project ID'),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional().nullable(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
    assigneeId: z.string().uuid('Invalid assignee ID').optional().nullable(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

// ─── Auth Schemas ───

const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(30),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// ─── Team Schemas ───

const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Team name is required').max(100),
    description: z.string().max(500).optional(),
  }),
});

const addTeamMemberSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
    role: z.enum(['ADMIN', 'MEMBER']).optional(),
  }),
});

// ─── Project Schemas ───

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required').max(100),
    description: z.string().max(1000).optional(),
    status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(1000).optional().nullable(),
    status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

// ─── Squad Schemas ───

const createSquadSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Squad name is required').max(100),
  }),
});

const addSquadMemberSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
  }),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  registerSchema,
  loginSchema,
  createTeamSchema,
  addTeamMemberSchema,
  createProjectSchema,
  updateProjectSchema,
  createSquadSchema,
  addSquadMemberSchema,
};
