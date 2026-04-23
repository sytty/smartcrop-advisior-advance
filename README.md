

AI-powered smart agriculture platform for farm operations, monitoring, analytics, and administration.

This repository is a monorepo with frontend, API, and PocketBase services running together.

For an additional first-time setup walkthrough, see [BUILD_AND_RUN_FROM_SCRATCH.md](BUILD_AND_RUN_FROM_SCRATCH.md).

## Table of Contents

1. Project Overview
2. Architecture
3. Tech Stack
4. Prerequisites
5. Quick Start
6. Environment Variables
7. Running the Project
8. Health Checks and Verification
9. Build and Start Modes
10. Linting and Quality
11. Migrations and PocketBase Operations
12. Troubleshooting
13. Security and Production Guidance
14. Repository Structure

## 1. Project Overview

Hostinger Horizons combines:

- AI-assisted agronomy workflows
- Crop, disease, weather, soil, water, and yield analytics
- IoT, drone, satellite, and field visualization modules
- Admin control center for user access, subsidy operations, system health, and model governance

Core outcomes:

- Faster decision-making for farmers and administrators
- Clear operational dashboards across critical workflows
- Unified data and authentication through PocketBase

## 2. Architecture

The platform runs as three core services:

- Web application at port 3000
- API service at port 3001
- PocketBase service at port 8090

Data flow:

1. Browser calls the web app
2. Web app requests API endpoints
3. API reads and writes to PocketBase collections
4. PocketBase provides auth, records, and real-time capabilities

## 3. Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, React Router, Recharts, Framer Motion
- API: Node.js, Express 5, Helmet, CORS, Morgan
- Backend data/auth: PocketBase
- Tooling: npm workspaces, ESLint, concurrently

## 4. Prerequisites

Required:

- Node.js 20 or newer
- npm 10 or newer
- Git

Recommended machine baseline:

- 4 CPU cores
- 8 GB RAM
- 2 GB free disk minimum

Version checks:

- node -v
- npm -v
- git --version

## 5. Quick Start

### 5.1 Clone and install

1. Clone the repository
2. Move into the project root
3. Install dependencies

Commands:

- git clone <your-repository-url>
- cd <your-repository-folder>
- npm install

### 5.2 Create root environment file

Create a root .env file and add at least the baseline values in the next section.

### 5.3 Run full development stack

- npm run dev

Alternative stack runner with health-oriented output:

- npm run dev:stack

Expected local URLs:

- Web: http://localhost:3000
- API: http://localhost:3001
- PocketBase: http://127.0.0.1:8090

## 6. Environment Variables

This project reads env files from service and root locations. The most reliable approach is to define shared values in root .env.

Suggested baseline root .env:

- NODE_ENV=development

- PORT=3001
- CORS_ORIGIN=http://localhost:3000
- API_BODY_LIMIT=1mb
- TRUST_PROXY=false
- LOG_LEVEL=debug
- RATE_LIMIT_WINDOW_MS=300000
- RATE_LIMIT_MAX=100

- PB_BASE_URL=http://127.0.0.1:8090
- POCKETBASE_URL=http://127.0.0.1:8090
- PB_HEALTH_RETRIES=10
- PB_HEALTH_DELAY_MS=1000

- PB_SUPERUSER_EMAIL=your-admin-email@example.com
- PB_SUPERUSER_PASSWORD=your-admin-password
- PB_ENCRYPTION_KEY=replace-with-a-long-random-secret

- VITE_API_URL=http://127.0.0.1:3001
- VITE_ML_API_URL=http://127.0.0.1:3001
- VITE_POCKETBASE_URL=http://127.0.0.1:8090
- VITE_REQUEST_TIMEOUT_MS=8000
- VITE_ML_REQUEST_TIMEOUT_MS=12000
- VITE_BACKEND_STATUS_POLL_MS=30000

Optional ML provider integration on API side:

- ML_PROVIDER_ENABLED=false
- ML_PROVIDER_URL=
- ML_PROVIDER_API_KEY=
- ML_PROVIDER_TIMEOUT_MS=12000

Important:

- Never commit real secrets
- Keep PB_ENCRYPTION_KEY safe and stable per environment
- Keep admin credentials different per environment

## 7. Running the Project

### 7.1 Run all services

- npm run dev

Starts:

- apps/web dev server
- apps/api server
- apps/pocketbase server

### 7.2 Run all services with custom stack script

- npm run dev:stack

Uses [scripts/dev-stack.mjs](scripts/dev-stack.mjs) and prints health/connectivity details.

### 7.3 Run each service independently

Web only:

- npm run dev --prefix apps/web

API only:

- npm run dev --prefix apps/api

PocketBase only:

- npm run dev --prefix apps/pocketbase

## 8. Health Checks and Verification

Primary health endpoints:

- API health: http://localhost:3001/health
- API readiness: http://localhost:3001/health/ready
- API PocketBase health: http://localhost:3001/health/pocketbase
- PocketBase health: http://127.0.0.1:8090/api/health

Smoke-test sequence:

1. Open web app on localhost:3000
2. Verify API health endpoints return success
3. Verify PocketBase health endpoint responds
4. Verify login/signup pages render
5. Verify a protected dashboard route loads after authentication

## 9. Build and Start Modes

### 9.1 Build

- npm run build

Current root build targets web output via workspace scripts.

### 9.2 Start mode

- npm run start

Runs API and PocketBase in start mode.

Web preview/start can be run from web workspace if needed.

## 10. Linting and Quality

Run full lint:

- npm run lint

Run workspace lint:

- npm run lint --prefix apps/web
- npm run lint --prefix apps/api

Recommended before any merge or release:

1. npm run lint
2. npm run build
3. Manual smoke test of health endpoints

## 11. Migrations and PocketBase Operations

PocketBase scripts are defined in [apps/pocketbase/package.json](apps/pocketbase/package.json).

Commands:

- npm run health --prefix apps/pocketbase
- npm run monitor --prefix apps/pocketbase
- npm run migrations:up --prefix apps/pocketbase
- npm run migrations:revert --prefix apps/pocketbase
- npm run migrations:snapshot --prefix apps/pocketbase
- npm run update --prefix apps/pocketbase

Use backups and snapshots before migration experiments.

## 12. Troubleshooting

### Port in use errors

Defaults:

- 3000 web
- 3001 api
- 8090 pocketbase

On Windows, find blocking processes:

- netstat -ano | findstr :3000
- netstat -ano | findstr :3001
- netstat -ano | findstr :8090

### npm install problems

1. Delete node_modules and package-lock.json
2. Run npm cache verify
3. Re-run npm install

### CORS issues

Ensure CORS_ORIGIN contains the active frontend origin.

### API cannot reach PocketBase

Verify:

- PocketBase process is running
- PB_BASE_URL and POCKETBASE_URL are correct
- health endpoint returns success

### Authentication/admin failures

Verify:

- PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD
- Admin user exists in PocketBase
- Token-bearing requests include proper auth headers

### Vite cannot resolve API base URL

Set VITE_API_URL and VITE_ML_API_URL in root .env and restart web dev server.

## 13. Security and Production Guidance

Before production deployment:

1. Replace all development credentials
2. Set strong PB_ENCRYPTION_KEY
3. Lock CORS to approved origins
4. Review rate-limits and proxy configuration
5. Keep secrets in a secret manager
6. Enable robust logging and monitoring
7. Validate backup and restore procedures

Additional production notes are available in [apps/pocketbase/PRODUCTION_SETUP.md](apps/pocketbase/PRODUCTION_SETUP.md).

## 14. Repository Structure

- [apps/web](apps/web): React + Vite frontend
- [apps/api](apps/api): Express API
- [apps/pocketbase](apps/pocketbase): PocketBase runtime, data hooks, migrations
- [scripts](scripts): root orchestration scripts
- [BUILD_AND_RUN_FROM_SCRATCH.md](BUILD_AND_RUN_FROM_SCRATCH.md): full first-time bootstrap guide

## References

- Root scripts: [package.json](package.json)
- Web scripts: [apps/web/package.json](apps/web/package.json)
- API scripts: [apps/api/package.json](apps/api/package.json)
- PocketBase scripts: [apps/pocketbase/package.json](apps/pocketbase/package.json)

## License

Proprietary. Define and apply your organization license policy before distribution.
