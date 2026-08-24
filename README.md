# TaskCraft Backend

TaskCraft is a gamified team, project, and task management REST API developed with Node.js, Express.js, PostgreSQL, and Prisma. The project was created as a backend development course project and extends the required Task CRUD operations with authentication, team management, squads, projects, validation, filtering, pagination, and gamification logic.

## Features

- User registration and login with JWT authentication
- Password hashing with bcryptjs
- Team management with OWNER, ADMIN, and MEMBER roles
- Squad/sub-team management
- Project management
- Task CRUD operations
- Task assignment to team members
- Task status and priority management
- Filtering, search, sorting, and pagination for tasks
- XP rewards for completed tasks
- Duplicate XP prevention through `xpAwarded`
- Request logger middleware
- Centralized error handling
- Request validation with Zod
- PostgreSQL database with Prisma ORM

## Tech Stack

- Node.js
- Express.js 5
- PostgreSQL
- Prisma ORM
- `pg` / Prisma PostgreSQL adapter
- JWT (`jsonwebtoken`)
- bcryptjs
- Zod
- Docker / Docker Compose
- Postman

## Project Structure

```text
.
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── docker-compose.yml
├── package.json
└── prisma.config.ts
```

## Prerequisites

Before running the project, install:

- Node.js
- npm
- Docker Desktop

## Installation

Clone the repository and enter the project folder:

```bash
git clone https://github.com/bugraberatkok/SoftwarePersona_Backend_Gelistirme_Projesi.git
cd SoftwarePersona_Backend_Gelistirme_Projesi
```

Install dependencies:

```bash
npm install
```

Create a local `.env` file by using `.env.example` as a template.

Example:

```env
PORT=3000
DATABASE_URL="postgresql://root:password@localhost:5433/taskcraft?schema=public"
JWT_SECRET="replace-with-your-own-secret"
JWT_EXPIRES_IN="24h"

POSTGRES_USER="root"
POSTGRES_PASSWORD="password"
POSTGRES_DB="taskcraft"
POSTGRES_PORT=5433
```

> Do not commit the real `.env` file or production secrets.

## Database Setup

Start PostgreSQL with Docker Compose:

```bash
docker compose up -d
```

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the Prisma schema to the database:

```bash
npx prisma db push
```

Insert demo data:

```bash
npx prisma db seed
```

The seed script creates demo users, a team, squads, projects, and sample tasks. Demo users use the password `password123`.

## Running the Application

Development mode:

```bash
npm run dev
```

Normal start:

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

## Core Task API

All Task routes require a valid Bearer token.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | List tasks |
| GET | `/api/tasks/:id` | Get task details |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Task listing also supports query parameters such as `projectId`, `status`, `priority`, `assigneeId`, `search`, `sortBy`, `order`, `page`, and `limit`.

## Authentication API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/auth/profile` | Get the authenticated user's profile |

After login, send the returned token with protected requests:

```text
Authorization: Bearer <TOKEN>
```

## Other API Areas

The application also includes routes for:

- Teams
- Team membership and role-based access
- Squads
- Squad membership
- Projects

## Logger Middleware

Every request is logged with the HTTP method, endpoint, and timestamp.

Example:

```text
POST /api/tasks — 2026-08-24T10:39:20.768Z
GET /api/tasks — 2026-08-24T10:39:31.565Z
PATCH /api/tasks/<id> — 2026-08-24T10:40:38.294Z
DELETE /api/tasks/<id> — 2026-08-24T10:40:56.488Z
```

## Task Gamification

When a task is completed, the assigned user can receive XP based on task priority. The `xpAwarded` field prevents the same task from repeatedly granting XP if its status is changed and completed again.

## Postman Testing

The mandatory Task CRUD flow was tested in Postman:

1. Create Task
2. List Tasks
3. Get Task Detail
4. Update Task
5. Delete Task

A separate Postman test report containing screenshots is included in the course submission materials.

## Author

Buğra Berat Kök
