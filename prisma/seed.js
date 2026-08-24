require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding Taskcraft database...\n');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.squadMember.deleteMany();
  await prisma.squad.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // ─── Create Users ───
  const alice = await prisma.user.create({
    data: { username: 'alice', email: 'alice@taskcraft.com', passwordHash, totalXp: 350 },
  });
  const bob = await prisma.user.create({
    data: { username: 'bob', email: 'bob@taskcraft.com', passwordHash, totalXp: 150 },
  });
  const charlie = await prisma.user.create({
    data: { username: 'charlie', email: 'charlie@taskcraft.com', passwordHash, totalXp: 50 },
  });
  const diana = await prisma.user.create({
    data: { username: 'diana', email: 'diana@taskcraft.com', passwordHash, totalXp: 0 },
  });

  console.log('✅ Users created: alice, bob, charlie, diana');
  console.log('   (All passwords: password123)\n');

  // ─── Create Team ───
  const team = await prisma.team.create({
    data: { name: 'IndieForge Studio', description: 'A creative indie development team' },
  });

  // ─── Add Members ───
  await prisma.teamMember.createMany({
    data: [
      { teamId: team.id, userId: alice.id, role: 'OWNER' },
      { teamId: team.id, userId: bob.id, role: 'ADMIN' },
      { teamId: team.id, userId: charlie.id, role: 'MEMBER' },
      { teamId: team.id, userId: diana.id, role: 'MEMBER' },
    ],
  });

  console.log('✅ Team "IndieForge Studio" created');
  console.log('   alice=OWNER, bob=ADMIN, charlie=MEMBER, diana=MEMBER\n');

  // ─── Create Squads ───
  const backendSquad = await prisma.squad.create({
    data: { name: 'Backend Squad', teamId: team.id },
  });
  const frontendSquad = await prisma.squad.create({
    data: { name: 'Frontend Squad', teamId: team.id },
  });
  const qaSquad = await prisma.squad.create({
    data: { name: 'QA Squad', teamId: team.id },
  });

  await prisma.squadMember.createMany({
    data: [
      { squadId: backendSquad.id, userId: alice.id },
      { squadId: backendSquad.id, userId: bob.id },
      { squadId: frontendSquad.id, userId: charlie.id },
      { squadId: frontendSquad.id, userId: diana.id },
      { squadId: qaSquad.id, userId: bob.id },
      { squadId: qaSquad.id, userId: charlie.id },
    ],
  });

  console.log('✅ Squads created: Backend, Frontend, QA');

  // ─── Create Projects ───
  const projectOrion = await prisma.project.create({
    data: {
      name: 'Project Orion',
      description: 'Main product development — MVP launch',
      teamId: team.id,
      status: 'ACTIVE',
    },
  });
  const internalDashboard = await prisma.project.create({
    data: {
      name: 'Internal Dashboard',
      description: 'Admin panel for team analytics',
      teamId: team.id,
      status: 'PLANNING',
    },
  });

  console.log('✅ Projects created: Project Orion (ACTIVE), Internal Dashboard (PLANNING)\n');

  // ─── Create Tasks ───
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Setup PostgreSQL and Prisma',
        description: 'Initialize database, create schema, and seed data',
        projectId: projectOrion.id,
        assigneeId: alice.id,
        priority: 'CRITICAL',
        status: 'COMPLETED',
        xpAwarded: true,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement JWT Authentication',
        description: 'Register, Login, and protected routes with JWT tokens',
        projectId: projectOrion.id,
        assigneeId: alice.id,
        priority: 'HIGH',
        status: 'COMPLETED',
        xpAwarded: true,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Build Team Management API',
        description: 'CRUD for teams, membership management, and role-based access',
        projectId: projectOrion.id,
        assigneeId: bob.id,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Create Task Filtering System',
        description: 'Support filtering by status, priority, assignee, and search',
        projectId: projectOrion.id,
        assigneeId: bob.id,
        priority: 'MEDIUM',
        status: 'TODO',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Design Frontend Layout',
        description: 'Create wireframes and component hierarchy for the dashboard',
        projectId: projectOrion.id,
        assigneeId: charlie.id,
        priority: 'MEDIUM',
        status: 'REVIEW',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write API Documentation',
        description: 'Document all endpoints with examples for Postman collection',
        projectId: projectOrion.id,
        priority: 'LOW',
        status: 'TODO',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Setup CI/CD Pipeline',
        description: 'Automate testing and deployment with GitHub Actions',
        projectId: internalDashboard.id,
        priority: 'LOW',
        status: 'TODO',
      },
    }),
    prisma.task.create({
      data: {
        title: 'Build Analytics Dashboard',
        description: 'Create reporting endpoints for team performance metrics',
        projectId: internalDashboard.id,
        assigneeId: diana.id,
        priority: 'HIGH',
        status: 'TODO',
      },
    }),
  ]);

  console.log(`✅ ${tasks.length} tasks created across both projects\n`);

  // ─── Summary ───
  console.log('═══════════════════════════════════════');
  console.log('  🎮 Taskcraft Seed Complete!');
  console.log('═══════════════════════════════════════');
  console.log(`  Team ID:            ${team.id}`);
  console.log(`  Project Orion ID:   ${projectOrion.id}`);
  console.log(`  Dashboard ID:       ${internalDashboard.id}`);
  console.log(`  Alice (OWNER) ID:   ${alice.id}`);
  console.log(`  Bob (ADMIN) ID:     ${bob.id}`);
  console.log(`  Charlie (MEMBER):   ${charlie.id}`);
  console.log(`  Diana (MEMBER):     ${diana.id}`);
  console.log('═══════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
