# Personal Blogging Platform API

A robust, secure, and scalable RESTful API for a personal blogging platform built with Node.js, Express.js, TypeScript, and PostgreSQL.

## Overview

This API allows users to register, log in, and manage their own blog posts. Public users can view all blog posts, while only authenticated users can create, update, or delete their own posts. The project follows a modular feature-based architecture with comprehensive validation, error handling, security middleware, and API documentation.

## Features

- User registration with strong password validation
- User authentication with JWT (1-day expiry)
- CRUD operations for blog posts
- Ownership-based access control (only post owners can update/delete)
- Request validation using Zod schemas
- Rate limiting (general and auth-specific)
- Security headers with Helmet
- CORS configuration
- Unified success and error response format
- Swagger API documentation at `/api-docs`
- Health check endpoint at `/health`

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| TypeScript | Type safety and developer experience |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and migrations |
| Zod | Request validation |
| bcrypt | Password hashing |
| JSON Web Token (JWT) | Authentication |
| Helmet | Security headers |
| CORS | Cross-origin resource sharing |
| express-rate-limit | Rate limiting |
| Swagger UI | API documentation |

## Architecture Overview

The project uses a modular feature-based architecture. Each domain (auth, posts) is self-contained with its own types, validation schemas, service layer, controller, and routes. Shared functionality (middleware, utilities, config) is extracted into common directories.

```
Client → Helmet/CORS/RateLimit → Express Router
  ├── /auth/* → validate → controller → service → Prisma → PostgreSQL
  └── /posts/* → [auth] → validate → controller → service → Prisma → PostgreSQL
       └── GET /posts is public (no auth)
```

### Request Lifecycle

1. Request received → Helmet adds security headers → CORS check → Rate limit check
2. Route matched → Auth middleware (if required) → Validation middleware (Zod) → Controller
3. Controller calls service → Service interacts with Prisma/PostgreSQL
4. Response formatted by utility helpers → Sent to client
5. Errors caught by global error handler → Formatted error response sent

## Project Structure

```
personal-blogging-platform-api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── env.ts
│   │   ├── prisma.ts
│   │   └── swagger.ts
│   ├── docs/
│   │   └── swagger.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── notFound.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validate.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.types.ts
│   │   │   └── auth.validation.ts
│   │   └── posts/
│   │       ├── post.controller.ts
│   │       ├── post.routes.ts
│   │       ├── post.service.ts
│   │       ├── post.types.ts
│   │       └── post.validation.ts
│   └── utils/
│       ├── AppError.ts
│       ├── asyncHandler.ts
│       ├── jwt.ts
│       ├── password.ts
│       └── response.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Database Design

### Entity Relationship Diagram

```
┌──────────────────────┐       ┌──────────────────────┐
│        User          │       │        Post          │
├──────────────────────┤       ├──────────────────────┤
│ id          UUID  PK │◄──────┤ id          UUID  PK │
│ name        VARCHAR  │ 1:N   │ title       VARCHAR  │
│ email       VARCHAR  │       │ content     TEXT     │
│ password    VARCHAR  │       │ authorId    UUID  FK │
│ createdAt   DateTime │       │ createdAt   DateTime │
│ updatedAt   DateTime │       │ updatedAt   DateTime │
└──────────────────────┘       └──────────────────────┘
```

### Why PostgreSQL Was Chosen

PostgreSQL was chosen because the project requires a relational structure between users and posts, strong data integrity, foreign key constraints, and reliable querying.

## Database Setup

This project uses PostgreSQL through Prisma ORM.

The database itself is **not included** in this repository. To run the project locally:

1. Ensure PostgreSQL is installed and running on your machine.
2. Create a new database (e.g., `personal_blog`).
3. Copy `.env.example` to `.env` and update `DATABASE_URL` with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/personal_blog?schema=public"
   ```
4. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
5. Run the Prisma migration to create the tables:
   ```bash
   npx prisma migrate dev --name init
   ```
   > **Note:** This project does not include pre-generated migration files. Running the command above will create them based on the `prisma/schema.prisma` file, which is the source of truth.
6. Start the development server:
   ```bash
   npm run dev
   ```

If you use a different PostgreSQL provider (e.g., cloud-hosted), you only need to replace `DATABASE_URL` with your own connection string. No other configuration is required.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/personal_blog` |
| `JWT_SECRET` | Secret key for JWT signing | (required) |
| `JWT_EXPIRES_IN` | JWT token expiration duration | `1d` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | CORS allowed origin | `*` |

## Installation

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/personal-blogging-platform-api.git
cd personal-blogging-platform-api

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your database URL and a strong JWT_SECRET

# 4. Generate Prisma client
npx prisma generate

# 5. Run Prisma migrations (creates tables in your database)
npx prisma migrate dev --name init

# 6. Start the development server
npm run dev
```

> **Prerequisites:** Node.js 18+ and PostgreSQL 15+ are required.

### Commands Reference

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | Open Prisma Studio (database GUI) |

## API Documentation

Swagger UI is available at `http://localhost:3000/api-docs` when the server is running.

## Endpoints

| Method | Path | Auth | Owner | Description |
|---|---|---|---|---|
| POST | `/auth/register` | No | — | Register a new user |
| POST | `/auth/login` | No | — | Log in and receive JWT |
| GET | `/posts` | No | — | Get all posts (sorted by newest) |
| POST | `/posts` | Yes | — | Create a new post |
| PUT | `/posts/:id` | Yes | Yes | Update own post |
| DELETE | `/posts/:id` | Yes | Yes | Delete own post |
| GET | `/` | No | — | Welcome message |
| GET | `/health` | No | — | Health check |

### Example Requests

#### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPass1!"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "StrongPass1!"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get All Posts

```bash
curl http://localhost:3000/posts
```

**Response (200):**
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "My First Post",
      "content": "This is the content of my first post.",
      "authorId": "550e8400-e29b-41d4-a716-446655440000",
      "author": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "My New Post",
    "content": "This is the content of my new post. It must be at least 10 characters."
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "title": "My New Post",
    "content": "This is the content of my new post. It must be at least 10 characters.",
    "authorId": "550e8400-e29b-41d4-a716-446655440000",
    "author": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe"
    },
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

#### Update Post

```bash
curl -X PUT http://localhost:3000/posts/660e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "My Updated Post",
    "content": "This is the updated content of my post."
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "title": "My Updated Post",
    "content": "This is the updated content of my post.",
    "authorId": "550e8400-e29b-41d4-a716-446655440000",
    "author": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe"
    },
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

#### Delete Post

```bash
curl -X DELETE http://localhost:3000/posts/660e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer <your-jwt-token>"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": null
}
```

## Authentication Flow

1. **Register**: User sends `name`, `email`, and `password` to `POST /auth/register`. Password is hashed with bcrypt (10 salt rounds) and stored. Returns user data without a token.
2. **Login**: User sends `email` and `password` to `POST /auth/login`. Server verifies credentials and returns a JWT token along with user data.
3. **Authenticated requests**: Include the JWT in the `Authorization: Bearer <token>` header. The auth middleware extracts and verifies the token on protected routes.
4. **Token expiry**: JWT expires after 1 day. Clients must log in again to obtain a new token.

## Validation Rules

### Register
| Field | Rule |
|---|---|
| `name` | Required, 2–50 characters |
| `email` | Required, valid email format |
| `password` | Required, minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character |

### Login
| Field | Rule |
|---|---|
| `email` | Required, valid email format |
| `password` | Required |

### Create/Update Post
| Field | Rule |
|---|---|
| `title` | Required, 3–150 characters |
| `content` | Required, 10–10000 characters |

## Error Response Format

### Validation Error (400)
```json
{
  "success": false,
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### Standard Error
```json
{
  "success": false,
  "message": "Post not found"
}
```

### HTTP Status Codes

| Code | Description |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized (missing/invalid token or invalid credentials) |
| 403 | Forbidden (not post owner) |
| 404 | Not found |
| 409 | Conflict (email already exists) |
| 500 | Internal server error |

## Security Features

- **Helmet**: Sets various HTTP headers to protect against well-known web vulnerabilities.
- **CORS**: Configurable cross-origin resource sharing.
- **Rate limiting**: 100 requests per 15 minutes general limit; 5 requests per 15 minutes on auth routes.
- **Password hashing**: bcrypt with 10 salt rounds — passwords are never stored in plain text.
- **JWT authentication**: Tokens expire after 24 hours. Protected routes verify the token on every request.
- **No password exposure**: Passwords are never returned in API responses. Safe user objects are returned manually or selected explicitly.
- **No stack trace exposure**: Production errors do not leak internal stack traces.
- **Environment variables**: All secrets (JWT_SECRET, DATABASE_URL) are loaded from `.env`, never committed.
- **Input validation**: All request bodies are validated with Zod schemas before reaching controllers.

## Git Workflow

### Commit Convention

```
<type>: <description>
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`

### Example Commits

```
chore: initialize express typescript project
chore: configure prisma and postgresql
feat: add authentication module
feat: add jwt authorization middleware
feat: add post CRUD operations
feat: add validation and error handling
docs: add swagger and readme
```

## Final Reviewer Checklist

Before submission, confirm the following:

- [ ] `.env` is **not** committed to the repository
- [ ] `.env.example` is committed with safe placeholder values
- [ ] `README.md` explains how to set up the database locally
- [ ] `prisma/schema.prisma` exists and is the source of truth for the database schema
- [ ] `npm run build` passes without errors
- [ ] Swagger UI is accessible at `/api-docs` when the server is running
- [ ] All required endpoints exist:
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /posts`
  - `POST /posts`
  - `PUT /posts/:id`
  - `DELETE /posts/:id`
- [ ] Passwords are never returned in any API response
- [ ] Only the owner of a post can update or delete it (403 if not owner)
- [ ] Author name is correct: **Mohamed Ayman**
- [ ] Project is ready to upload to GitHub

## Author

**Mohamed Ayman**

---

*Built for internship submission.*
