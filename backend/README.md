# Backend Foundation

Node.js, Express, MongoDB Atlas, Mongoose, JWT authentication, refresh-token sessions, RBAC, Socket.io, Cloudinary, and Swagger foundation.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Fill required values in `.env`:

```text
MONGODB_URI
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

4. Start development server:

```bash
npm run dev
```

API health check:

```text
GET http://localhost:5000/health
```

Swagger docs:

```text
http://localhost:5000/api-docs
```

## Seed Admin

Set these env vars before running:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongPassword123
ADMIN_NAME="Platform Admin"
npm run seed:admin
```

On Windows PowerShell:

```powershell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="StrongPassword123"
$env:ADMIN_NAME="Platform Admin"
npm run seed:admin
```

## Auth Routes

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

## Roles

```text
buyer
seller
admin
```

AI and payment implementations are intentionally not included in this phase.
