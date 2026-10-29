# My-Blog-Api

REST api for the 'POSTED' -blog with posts and comments , that handles authentication with JWT and role-based access control.

## Features
- Create, read, update, and delete posts
- Comments on posts

## Tech Stack
Node.js, Express, Prisma, PostgreSQL, JWT

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL running locally

### Installation
```bash
git clone https://github.com/Paung1999/my-blog-api.git
cd my-blog-api
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### Environment Variables
| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret used to sign tokens |
| PORT | Port the server runs on |

## API Routes

| Method | Endpoint            | Auth | Description          |
|--------|---------------------|------|----------------------|
| GET    | /posts              | No   | List all posts       |
| GET    | /posts/:id          | No   | Get one post         |
| POST   | /posts              | Yes  | Create a post        |
| PUT    | /posts/:id          | Yes  | Update a post        |
| DELETE | /posts/:id          | Yes  | Delete a post        |
| POST   | /posts/:id/comments | Yes  | Add a comment        |
| PUT    | /comments/:id       | Yes  | Update a comment     |
| DELETE | /comments/:id       | Yes  | Delete a comment     |
| GET    | /users/verify       | No   | Verify a user        |
| POST   | /users/register     | No   | Register a user      |
| POST   | /users/login        | No   | Login a user         |

## Related Repository
The frontend for this backend is [posted](https://github.com/Paung1999/posted.git)