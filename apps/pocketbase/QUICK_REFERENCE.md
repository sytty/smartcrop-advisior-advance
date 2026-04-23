# 🔧 PocketBase Quick Reference

## Production-Ready Backend Server

### 🚀 Quick Start

```bash
# Start full development stack with enhanced monitoring
npm run dev:stack

# Or monitor PocketBase separately
npm run --prefix apps/pocketbase monitor
```

### 📍 Access Points

| Service | Local | Network | Status |
|---------|-------|---------|--------|
| **PocketBase API** | `http://127.0.0.1:8090/api/` | `http://10.98.181.228:8090/api/` | ✅ |
| **Admin Dashboard** | `http://127.0.0.1:8090/_/` | `http://10.98.181.228:8090/_/` | ✅ |
| **API Server** | `http://127.0.0.1:3001` | `http://10.98.181.228:3001` | ✅ |
| **Web App** | `http://127.0.0.1:3000` | `http://10.98.181.228:3000` | ✅ |

### 🔐 Admin Login

```
Email:    admin@local4.dev
Password: Admin124!Admin123!
```

### 📊 Configuration

**Encryption:**
- Key: `7f3e9a2b5c1d8f4e6a9c3b1d7e5a2f8c` (32-byte AES)
- Stored in: `apps/pocketbase/.env`

**Database:**
- Type: SQLite3 with WAL mode
- Location: `apps/pocketbase/pb_data/data.db`
- Max Connections: 25
- Auto-Migrations: Enabled

**Performance:**
- Cache TTL: 1 hour
- Query Timeout: 30 seconds
- Max Body Size: 5 MB
- Rate Limit: 300 req/min per IP

**Backup:**
- Frequency: Daily
- Retention: 7 days
- Location: `apps/pocketbase/pb_data/backups`

### 📂 Collections (62+ Tables)

**Core:**
- users, farms, fields, crops

**AI & Analytics:**
- voice_conversations, diagnoses
- model_metrics, audit_logs

**Operations:**
- subsidy_applications, subsidy_eligibility
- regional_alerts, offline_cache

### 🛠️ Common Commands

```bash
# Check health
npm run --prefix apps/pocketbase health

# Monitor in real-time
npm run --prefix apps/pocketbase monitor

# Run pending migrations
npm run --prefix apps/pocketbase migrations:up

# Revert last migration
npm run --prefix apps/pocketbase migrations:revert

# Create database snapshot
npm run --prefix apps/pocketbase migrations:snapshot

# Update PocketBase binary
npm run --prefix apps/pocketbase update
```

### 🔍 Troubleshooting

**Port already in use:**
```bash
netstat -ano | findstr ":8090"
taskkill /PID <PID> /F
```

**Database corrupted:**
```bash
rm -r apps/pocketbase/pb_data
npm run dev:stack
```

**Migrations failed:**
```bash
npm run --prefix apps/pocketbase migrations:revert
npm run --prefix apps/pocketbase migrations:up
```

### 📋 Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables & credentials |
| `pb_config.json` | Production settings |
| `pb_migrations/` | Database schema versions |
| `pb_hooks/` | Custom backend logic |
| `pb_data/` | Database & files storage |
| `PRODUCTION_SETUP.md` | Detailed guide |

### 🎯 Key Features

✅ **Secure** - AES-256 encryption, SSL-ready, CORS protected
✅ **Fast** - WAL mode, connection pooling, caching
✅ **Reliable** - Auto-backups, health checks, error recovery
✅ **Scalable** - Rate limiting, pagination, compression
✅ **Observable** - Logging, metrics, monitoring dashboard
✅ **Maintainable** - Migrations, hooks, custom commands

### 📞 Need Help?

1. Check `PRODUCTION_SETUP.md` for detailed documentation
2. View logs: `apps/pocketbase/pb_data/logs/`
3. Test health: `curl http://127.0.0.1:8090/api/health`
4. PocketBase docs: https://pocketbase.io/docs/

---

**Version**: 1.0.0 | **Status**: Production Ready ✅ | **Updated**: April 22, 2026
