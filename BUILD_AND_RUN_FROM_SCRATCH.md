# Build and Run From Scratch

This guide helps you bootstrap the full Smart Agriculture Platform locally.

## Prerequisites

- Node.js 20+
- npm 10+

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

Create a root `.env` file:

```env
# PocketBase
# Generate with: openssl rand -base64 32
PB_ENCRYPTION_KEY=replace-with-a-strong-random-key
POCKETBASE_URL=http://127.0.0.1:8090

# API
PORT=3001
CORS_ORIGIN=http://localhost:3000
PB_BASE_URL=http://127.0.0.1:8090
PB_SUPERUSER_EMAIL=your-admin-email
PB_SUPERUSER_PASSWORD=your-admin-password

# Web (optional overrides)
VITE_API_URL=http://127.0.0.1:3001
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

## 3) Start full development stack

```bash
npm run dev
```

Services:

- Web: http://localhost:3000
- API: http://localhost:3001
- PocketBase: http://127.0.0.1:8090

Optional stack launcher with health summary:

```bash
npm run dev:stack
```

## 4) Useful validation commands

```bash
npm run lint
npm run build
npm run health:pocketbase
```

## 5) Health checks

- API health: http://localhost:3001/health
- API readiness: http://localhost:3001/health/ready
- PocketBase through API: http://localhost:3001/health/pocketbase
