# smartcrop-advisior-advance
 smart agriculture platform built to help farmers, agribusiness teams, and administrators make faster, data-driven decisions. The system combines AI analytics, real-time monitoring, and operational workflows in one unified product.

AI-powered smart agriculture platform that unifies farm operations, predictive intelligence, and real-time monitoring into one production-ready system.

New to this repository?

Start with the full setup manual: [BUILD_AND_RUN_FROM_SCRATCH.md](BUILD_AND_RUN_FROM_SCRATCH.md)

## Why This Project

Hostinger Horizons helps farmers, agribusiness teams, and administrators make faster, data-driven decisions by combining:

- AI-assisted crop and disease intelligence
- Weather, soil, water, and yield analytics
- IoT and drone-based monitoring workflows
- Subsidy and governance operations for administrators

## Key Features

- Authentication and access control
  - Signup, login, password reset, session persistence
  - Protected routes and role-based dashboards
- AI and analytics suite
  - Weather impact analytics
  - Crop disease detection
  - Yield prediction
  - Soil health and water optimization
  - Cost-benefit and farmer performance analysis
- IoT and field intelligence
  - IoT sensor dashboards
  - Drone monitoring
  - Satellite and AR-assisted field views
- Admin operations
  - Subsidy workflows
  - Audit logging and system monitoring
  - Model and platform health tracking
- Platform quality
  - Real-time data sync
  - Internationalization (including RTL support)
  - Error boundaries and resilience patterns
  - Performance-focused React/Vite setup

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, React Router, Recharts, Framer Motion
- Backend API: Node.js, Express 5, Helmet, CORS
- Data Layer: PocketBase (auth, real-time, collections, hooks, migrations)
- Tooling: ESLint, npm workspaces, concurrently

## Monorepo Structure

    apps/
      web/         React + Vite frontend
      api/         Express API service
      pocketbase/  PocketBase runtime, migrations, hooks
    scripts/       Dev stack orchestration scripts

## Getting Started

### 1. Prerequisites

- Node.js 20+
- npm 10+

### 2. Install Dependencies

    npm install

### 3. Configure Environment Variables

Create a root .env file with values for your local setup:

    # PocketBase
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

### 4. Run the Full Development Stack

    npm run dev

This starts:

- Web app at http://localhost:3000
- API server at http://localhost:3001
- PocketBase at http://127.0.0.1:8090

Alternative launcher with automatic health summary:

    npm run dev:stack

## Useful Commands

    npm run dev               # Start web + api + pocketbase
    npm run dev:stack         # Start stack with periodic health output
    npm run lint              # Lint web and api
    npm run build             # Build web output
    npm run start             # Start api + pocketbase in start mode
    npm run health:pocketbase # Check pocketbase health

## Health Endpoints

- API health: http://localhost:3001/health
- API readiness: http://localhost:3001/health/ready
- PocketBase through API: http://localhost:3001/health/pocketbase

## Production Notes

- Keep all credentials in environment variables and never hardcode secrets.
- Rotate admin credentials and encryption keys before production deployment.
- Ensure CORS, rate limits, and proxy settings are configured for your environment.

## Project Status

The project includes a broad feature surface (80+ pages) across AI analytics, operational dashboards, and administration workflows, with verified service connectivity and end-to-end readiness checks.

## Contributing

1. Create a feature branch
2. Commit focused changes
3. Run lint and validation checks
4. Open a pull request with a clear summary

## License

Proprietary. Add your preferred license terms before open-source distribution.

