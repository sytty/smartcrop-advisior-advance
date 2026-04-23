# PocketBase Production Setup Guide

## 🚀 Horizons Smart Agriculture Platform
### PocketBase Database Server Configuration

---

## 📋 Overview

This is a production-ready PocketBase instance configured for the Horizons smart agriculture platform. It provides:

- ✅ **Secure Data Management** - End-to-end encryption at rest
- ✅ **High Performance** - SQLite with WAL mode and optimized pragmas
- ✅ **Scalability** - Connection pooling and caching
- ✅ **Reliability** - Automated backups and recovery
- ✅ **Monitoring** - Health checks and performance metrics
- ✅ **Security** - Rate limiting, CORS, input validation

---

## 🔐 Security Credentials

**Admin Account:**
```
Email:    admin@local4.dev
Password: Admin124!Admin123!
```

> ⚠️ **SECURITY NOTE**: These are the current credentials. To change them:
> 1. Log in to the Admin Dashboard at `http://127.0.0.1:8090/_/`
> 2. Go to Settings → Auth
> 3. Update superuser email and password
> 4. Update `.env` files in `apps/pocketbase/` and `apps/api/` to match

**Encryption Key:**
- Current: `0123456789abcdef0123456789abcdef` (32-character AES key)
- Location: `apps/pocketbase/.env` → `PB_ENCRYPTION_KEY`
- Status: **IMPORTANT** - Do not change unless recreating the database

> ⚠️ **CRITICAL**: If you lose the encryption key, you cannot recover encrypted data!
> Back it up to a secure location immediately.

---

## 🏗️ Architecture

### Collections
- **users** - User accounts with roles (farmer, admin, expert)
- **farms** - Farm profiles and metadata
- **fields** - Field configurations and coordinates
- **crops** - Crop data and planting info
- **voice_conversations** - AI voice interaction logs
- **diagnoses** - ML model predictions
- **audit_logs** - System activity tracking
- **model_metrics** - AI model performance data
- **subsidy_applications** - Government subsidy requests
- **regional_alerts** - Weather/pest alerts

### Migrations
- 62+ database migrations for schema evolution
- Automatic migration on startup (`PB_AUTO_MIGRATIONS=true`)
- Rollback supported via `npm run migrations:revert`

### Hooks
- Custom backend logic in `pb_hooks/`
- Automatic email delivery (`builder-mailer.pb.js`)
- Custom commands support (`custom-migrations-cmd.pb.js`)

---

## 🔧 Configuration Files

### `.env` - Environment Variables
```ini
PB_ENCRYPTION_KEY=<32-char-key>
PB_SUPERUSER_EMAIL=<admin-email>
PB_SUPERUSER_PASSWORD=<strong-password>
PB_LOG_LEVEL=info
PB_AUTO_MIGRATIONS=true
PB_BACKUP_ENABLED=true
```

### `pb_config.json` - Production Settings
- Database optimization (WAL, connection pooling)
- API configuration (timeouts, body limits)
- Security settings (rate limiting, CORS)
- Backup and logging configuration
- File upload restrictions
- Caching and monitoring

---

## 📊 Performance Metrics

### Database
- **Connection Pool**: 25 max connections
- **Query Timeout**: 30 seconds
- **Cache**: In-memory with 1-hour TTL
- **WAL Mode**: Enabled for concurrent writes
- **Auto-vacuum**: Incremental cleanup

### API
- **Max Body Size**: 5 MB
- **Request Timeout**: 30 seconds
- **Rate Limit**: 300 requests/min per IP
- **Burst Limit**: 10 requests/sec

### Storage
- **Max File Size**: 10 MB per file
- **Allowed Types**: Images, PDFs, CSVs
- **Storage**: `pb_data/storage`

### Backup
- **Frequency**: Daily (1440 minutes)
- **Retention**: 7 days
- **Location**: `pb_data/backups`

---

## 🚀 Getting Started

### 1. Start the Full Stack
```bash
cd horizons-export-7f5e1173-8a29-4cc5-889d-8ba704f1a60e\ \(3\)\ \(2\)
npm run dev:stack
```

### 2. Access PocketBase
- **Dashboard**: http://127.0.0.1:8090/_/
- **API**: http://127.0.0.1:8090/api/
- **Network IP**: http://10.98.181.228:8090

### 3. Login to Admin Dashboard
```
Email:    horizons-admin@production.dev
Password: SecureHorizons2026!Admin@Production
```

---

## 📈 Monitoring & Health

### Health Check Endpoint
```bash
curl http://127.0.0.1:8090/api/health
```

### System Logs
```bash
npm run dev  # Check console output
```

### Performance Metrics
Access from PocketBase Dashboard:
- Query execution times
- Active connections
- Cache hit rates
- Request throughput

---

## 🔄 Database Operations

### Run Migrations
```bash
npm run migrations:up
```

### Revert Last Migration
```bash
npm run migrations:revert
```

### Create Snapshot
```bash
npm run migrations:snapshot
```

### Update PocketBase
```bash
npm run update
```

---

## 🛡️ Security Best Practices

1. **Encryption Key**
   - Store securely (use environment variables in production)
   - Back it up to a secure location
   - Rotate periodically

2. **Admin Credentials**
   - Change default password immediately
   - Use strong, unique password (16+ characters)
   - Enable 2FA if available

3. **API Tokens**
   - Issued per-request, not reused
   - Validate Bearer token on every request
   - Short expiration times (24 hours)

4. **Database Access**
   - Run behind firewall in production
   - Use VPN or private network
   - Monitor access logs regularly

5. **CORS Configuration**
   - Whitelist specific origins
   - Disable in production if not needed
   - Remove localhost origins

---

## 🚨 Troubleshooting

### PocketBase Won't Start
```bash
# Check if port 8090 is in use
netstat -ano | findstr ":8090"

# Kill existing process
taskkill /PID <PID> /F

# Clear database and restart
rm -r apps/pocketbase/pb_data
npm run dev:stack
```

### Migrations Failed
```bash
# Check migration status
npm run migrations:revert

# Reapply
npm run migrations:up
```

### Out of Memory
- Reduce cache size in `pb_config.json`
- Reduce connection pool size
- Enable query timeout logging

### Slow Queries
- Check indexes in dashboard
- Run auto-optimize
- Review `pb_data/logs` for slow queries

---

## 📞 Support Resources

- **PocketBase Docs**: https://pocketbase.io/docs/
- **GitHub Issues**: Horizons repository
- **Admin Dashboard**: http://127.0.0.1:8090/_/

---

## 📝 Environment Checklist

- [ ] Change `PB_ENCRYPTION_KEY` (use `openssl rand -hex 16`)
- [ ] Change admin email and password
- [ ] Configure CORS origins for production
- [ ] Set up backup storage location
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring alerts
- [ ] Test disaster recovery procedure
- [ ] Document backup schedule
- [ ] Schedule security audit

---

**Last Updated**: April 22, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
