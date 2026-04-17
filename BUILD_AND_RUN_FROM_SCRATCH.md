# Build and Run From Scratch Guide

This guide is written for GitHub users who are cloning this project for the first time and want a dependable path from zero to a running local stack.

It covers:
- Machine requirements
- Clean installation from a fresh clone
- Environment variable setup
- Development and production-style runs
- Health checks and verification
- Common errors and fixes
- Safe operational practices

## 1. What You Are Running

This repository is a monorepo with three main services:

- apps/web: React + Vite frontend, default port 3000
- apps/api: Express API, default port 3001
- apps/pocketbase: PocketBase backend and data services, default port 8090

The root project orchestrates these services with npm workspaces and concurrent scripts.

## 2. System Requirements

Minimum recommended:
- CPU: 4 cores
- RAM: 8 GB
- Disk: 2 GB free (more if running long-term local data)

Software requirements:
- Git 2.40 or newer
- Node.js 20 or newer
- npm 10 or newer

How to verify:

Git
  git --version

Node
  node -v

npm
  npm -v

If your versions are lower, upgrade first. Most startup problems in JavaScript monorepos come from old Node/npm versions.

## 3. Fresh Clone

Choose a folder where you keep development repositories and run:

  git clone <YOUR_REPOSITORY_URL>
  cd <REPOSITORY_FOLDER>

Confirm you are at the root where package.json is present:

  dir

or

  ls

You should see folders like apps and scripts.

## 4. Install Dependencies

From repository root:

  npm install

This installs root and workspace dependencies.

Expected behavior:
- You should not see a fatal error at the end.
- A node_modules folder appears at the root.

If install fails:
- Delete node_modules and package-lock.json, then reinstall.
- Ensure you are not behind a strict proxy that blocks npm.
- Retry with a clean npm cache:

  npm cache verify

If needed:

  npm cache clean --force
  npm install

## 5. Environment Variables Setup

This project reads env values from multiple locations, but the easiest and most predictable setup is:
- root .env for shared values
- service-specific env files if needed

Important: never commit real secrets.

### 5.1 Create Root .env

Create a .env file in repository root with the following baseline values:

  NODE_ENV=development

  # API
  PORT=3001
  CORS_ORIGIN=http://localhost:3000
  API_BODY_LIMIT=1mb
  TRUST_PROXY=false
  LOG_LEVEL=debug
  RATE_LIMIT_WINDOW_MS=300000
  RATE_LIMIT_MAX=100

  # PocketBase connection from API
  PB_BASE_URL=http://127.0.0.1:8090
  POCKETBASE_URL=http://127.0.0.1:8090
  PB_HEALTH_RETRIES=10
  PB_HEALTH_DELAY_MS=1000

  # PocketBase superuser for API-side admin operations
  PB_SUPERUSER_EMAIL=your-admin-email@example.com
  PB_SUPERUSER_PASSWORD=your-admin-password

  # PocketBase encryption key
  PB_ENCRYPTION_KEY=replace-with-a-long-random-secret

  # Web runtime overrides (optional)
  VITE_API_URL=http://127.0.0.1:3001
  VITE_POCKETBASE_URL=http://127.0.0.1:8090
  VITE_REQUEST_TIMEOUT_MS=8000
  VITE_BACKEND_STATUS_POLL_MS=30000

### 5.2 About the Encryption Key

PB_ENCRYPTION_KEY should be strong and random. In production, treat it as highly sensitive:
- Store in secret manager
- Rotate using controlled process
- Never print in logs
- Never push to Git

### 5.3 About Superuser Credentials

PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD are used for operations requiring elevated backend access.

For local development:
- Use throwaway credentials
- Keep the account restricted to local use

For production:
- Use unique credentials per environment
- Rotate regularly
- Monitor failed logins

## 6. Start Everything in Development Mode

From repository root:

  npm run dev

This starts all services concurrently:
- web on 3000
- api on 3001
- pocketbase on 8090

Alternative launcher with periodic health summary:

  npm run dev:stack

This is helpful if you want a rolling health view while services warm up.

## 7. Verify Health and Connectivity

Open these URLs in a browser:
- http://localhost:3000
- http://localhost:3001/health
- http://localhost:3001/health/ready
- http://localhost:3001/health/pocketbase
- http://127.0.0.1:8090/api/health

Expected outcome:
- Web app loads
- API health endpoints return success JSON
- PocketBase health endpoint responds OK

If one service is down, read the terminal that runs that service first. Most issues are visible there.

## 8. First-Run Functional Smoke Test

Use this order after stack startup:

1. Open web app at localhost:3000
2. Navigate to authentication pages
3. Confirm login/signup forms render
4. Confirm dashboard pages are reachable after auth
5. Open API health routes
6. Open PocketBase health route

If all six pass, your local platform is basically healthy.

## 9. Build the Project

From repository root:

  npm run build

Current root build script builds the web package.

Expected output:
- Frontend build artifacts in dist/apps/web

If build fails:
- Inspect first error line, not the final summary
- Fix env mismatch or dependency mismatch
- Re-run after clean install if needed

## 10. Run in Start Mode

From repository root:

  npm run start

This starts API and PocketBase with start scripts.

If you also need to serve web output, you can use the web preview/start command from apps/web package context.

## 11. Lint and Code Quality Check

From repository root:

  npm run lint

This runs lint for web and api workspaces.

Recommended before PR:
- npm run lint
- npm run build
- local smoke test of health URLs

## 12. Service-by-Service Control

You can run each app directly.

PocketBase only:
  npm run dev --prefix apps/pocketbase

API only:
  npm run dev --prefix apps/api

Web only:
  npm run dev --prefix apps/web

This is useful when debugging startup order, env issues, or API contract changes.

## 13. Data and Migrations

PocketBase package includes migration commands.

Apply migrations:
  npm run migrations:up --prefix apps/pocketbase

Revert migration:
  npm run migrations:revert --prefix apps/pocketbase

Create snapshot:
  npm run migrations:snapshot --prefix apps/pocketbase

Guidance:
- Take backups before migration experiments
- Do not run destructive migration steps against live production data without validated rollback

## 14. Port and Network Conflicts

Default ports:
- 3000 web
- 3001 api
- 8090 pocketbase

If a port is busy:
- Stop conflicting process
- Or change env/config for that service

Windows process check example:
  netstat -ano | findstr :3000
  netstat -ano | findstr :3001
  netstat -ano | findstr :8090

Then terminate by PID if needed.

## 15. Common Startup Errors and Fixes

### Error: EADDRINUSE
Cause:
- Port already in use

Fix:
- Stop existing process on that port
- Restart service

### Error: CORS origin not allowed
Cause:
- Browser origin missing in CORS_ORIGIN

Fix:
- Add your web URL to CORS_ORIGIN
- For multiple origins, use comma-separated values

### Error: PocketBase health unavailable
Cause:
- PocketBase not running or wrong base URL

Fix:
- Confirm pocketbase process is alive
- Confirm PB_BASE_URL and POCKETBASE_URL
- Retry /api/health route

### Error: Authentication requests fail
Cause:
- Superuser credentials missing or invalid

Fix:
- Recheck PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD
- Confirm user exists in PocketBase

### Error: Build passes, runtime fails
Cause:
- Runtime env not loaded

Fix:
- Recheck env files loaded by each service
- Keep critical values in root .env to reduce ambiguity

## 16. Clean Rebuild Procedure

When in doubt, do a clean rebuild:

1. Stop all running services
2. Remove node_modules
3. Remove package-lock.json (if needed)
4. Run npm install
5. Recheck .env values
6. Run npm run dev
7. Validate health endpoints

This resolves most local corruption or stale package lock issues.

## 17. Recommended Local Workflow

Daily workflow:

1. Pull latest changes
2. Install if package files changed
3. Start stack with npm run dev
4. Watch service logs for warnings
5. Develop and test feature
6. Run lint
7. Build once before pushing

Pre-push checklist:
- Lint clean
- Build successful
- Health endpoints OK
- No secrets in tracked files

## 18. Security and Secret Hygiene

Never commit:
- Real admin credentials
- Real PB_ENCRYPTION_KEY
- Production API keys

Use:
- .gitignore for local secrets
- Secret injection in CI/CD
- Environment-separated credentials

If a secret was exposed:
1. Rotate immediately
2. Invalidate old credential
3. Purge from Git history if necessary
4. Audit logs for misuse

## 19. CI/CD Baseline Outline

A basic pipeline should:

1. Install Node and npm
2. Run npm ci
3. Run npm run lint
4. Run npm run build
5. Optionally run service smoke tests

Deployment should inject environment variables securely and never rely on committed .env files.

## 20. Containerization Note

If you package this stack into containers later:
- Keep web, api, and pocketbase as separate services
- Mount persistent volume for PocketBase data
- Inject secrets at runtime
- Place API behind reverse proxy with TLS

## 21. Windows-Specific Notes

- Run terminal as normal user unless privileged operation is required
- If path issues occur, use full paths in scripts
- Ensure antivirus is not blocking node binaries or workspace scripts

## 22. macOS and Linux Notes

- Ensure executable permissions where needed
- Use shell profile to set Node version manager defaults
- Avoid mixing package managers for the same workspace

## 23. How to Share This with GitHub Users

Place this file in repository root and reference it from README under Getting Started.

Suggested callout text:
- New here? Follow BUILD_AND_RUN_FROM_SCRATCH.md for a full zero-to-running setup.

This reduces onboarding friction and support load.

## 24. Final Quick Start (One Screen)

If you only need the shortest path:

1. Clone repository
2. Create root .env with required values
3. Run npm install
4. Run npm run dev
5. Open localhost:3000
6. Verify localhost:3001/health

## 25. Operational Confidence Checklist

You are ready for active development if all are true:
- npm install succeeds
- npm run dev starts all services
- web, api, and pocketbase health routes respond
- authentication pages load
- dashboard routes render after auth

At this point, your local environment is fully usable.

## 26. Support Triage Template

When reporting an issue, include:
- OS and version
- Node and npm versions
- Command run
- Full first error block from terminal
- Which service failed: web, api, or pocketbase
- Current env values names (not secret values)

This helps maintainers reproduce and fix quickly.

## 27. Maintenance Recommendations

Monthly:
- Refresh dependencies in controlled batch
- Run lint and build after upgrades
- Validate key flows: auth, dashboards, health routes

Quarterly:
- Review env variables for drift
- Rotate development secrets
- Validate migration and backup workflow

## 28. Closing Notes

This monorepo is structured for practical local development with clear service boundaries. If you follow this guide in sequence, most first-run errors can be prevented.

The most important factors are:
- Correct Node/npm versions
- Complete env configuration
- Health-check verification after startup

Once those are in place, the project is straightforward to build and run from scratch.
