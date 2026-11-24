# Developer Environment & System Setup Guide

**Document Version:** 1.0.0  
**Target Audience:** Core Engineers, DevOps, Contributors  
**Related Documents:** [PRD.md](file:///c:/Projects/Youtube%20Automation%20Studio/docs/PRD.md) · [ARCHITECTURE.md](file:///c:/Projects/Youtube%20Automation%20Studio/docs/ARCHITECTURE.md) · [IMPLEMENTATION_PLAN.md](file:///c:/Projects/Youtube%20Automation%20Studio/docs/IMPLEMENTATION_PLAN.md)

---

## 1. System Prerequisites

Before starting development on **YT Automation Studio**, verify that your host machine meets the following runtime requirements:

| Tool / Runtime | Minimum Version | Recommended Version | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 22.0.0` | `v22.19.0+` (LTS) | `node -v` |
| **pnpm** | `>= 12.0.0` | `12.15.0+` | `pnpm -v` |
| **Docker Engine** | `>= 24.0.0` | `26.0.0+` | `docker --version` |
| **Docker Compose** | `>= 2.20.0` | `2.27.0+` | `docker compose version` |
| **Git** | `>= 2.40.0` | Latest | `git --version` |
| **OpenSSL** | Latest | Latest | `openssl version` |

> [!IMPORTANT]
> This project requires **pnpm v12+**. Do not use `npm` or `yarn` directly, as workspace configurations and native binary build permissions (`allowBuilds`) are managed specifically through `pnpm-workspace.yaml`.

---

## 2. Repository Cloning & Workspace Initialization

Clone the repository and install workspace dependencies:

```bash
# Clone the repository
git clone https://github.com/your-org/youtube-automation-studio.git
cd youtube-automation-studio

# Install dependencies across all monorepo apps and packages
pnpm install
```

### 2.1 Approving Build Scripts in pnpm v12
pnpm v12 enforces isolated supply-chain security by blocking postinstall build scripts by default. The monorepo has pre-approved `esbuild` and `msgpackr-extract` in `pnpm-workspace.yaml`. If prompted during installation, approve required builds:

```bash
pnpm approve-builds --all
pnpm install
```

---

## 3. Environment Variables Configuration

Copy the master environment template and populate local credentials:

```bash
cp .env.example .env
```

### 3.1 Generating Cryptographic Keys
YT Automation Studio requires two distinct cryptographic keys:

1. **AES-256-GCM Master Encryption Key (`TOKEN_ENCRYPTION_KEY_HEX`):**  
   Strict 64-hexadecimal character key (32 bytes = 256 bits) used to encrypt Google OAuth tokens at rest.
   ```bash
   openssl rand -hex 32
   ```
2. **JWT Secret Keys (`JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`):**  
   Random cryptographic strings (minimum 32 characters each) for signing access and refresh tokens.
   ```bash
   openssl rand -base64 36
   ```

### 3.2 Key Environment Settings in `.env`

```env
# Application Core
NODE_ENV=development
API_PORT=4000
WEB_PORT=3000
CORS_ORIGIN=http://localhost:3000

# MongoDB (Replica Set required for transactions)
MONGO_PORT=27017
MONGODB_URI=mongodb://localhost:27017/yt_automation_studio?replicaSet=rs0&directConnection=true

# Redis (BullMQ Queues)
REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASSWORD=redis_dev_secret_456
REDIS_URL=redis://:redis_dev_secret_456@localhost:6379

# n8n Visual Automation Runtime
N8N_PORT=5678
N8N_WEBHOOK_URL=http://localhost:5678/
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin_n8n_secret_789

# Security (Non-Negotiable)
JWT_ACCESS_SECRET=your_generated_32_character_access_secret
JWT_REFRESH_SECRET=your_generated_32_character_refresh_secret
TOKEN_ENCRYPTION_KEY_HEX=your_generated_64_character_hex_key

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/api/v1/youtube/oauth2/callback

# AI Provider API Keys
DEFAULT_LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## 4. Starting Infrastructure via Docker Compose

The platform requires MongoDB (replica set `rs0`), Redis (persistent with `noeviction` for BullMQ), and self-hosted n8n:

```bash
# Validate Docker Compose syntax
pnpm run test:compose

# Start containers in background mode
pnpm run docker:up

# Verify running services and health status
docker compose ps
```

### 4.1 Expected Container Topology

| Container Name | Service | Internal Port | Host Port | Health Check |
| :--- | :--- | :--- | :--- | :--- |
| `yt-studio-mongo` | MongoDB 7.0 | `27017` | `27017` | `mongosh --eval "db.adminCommand('ping')"` |
| `yt-studio-mongo-init` | Replica Set Provisioner | N/A | N/A | One-shot (`rs.initiate()`) |
| `yt-studio-redis` | Redis 7.2 Alpine | `6379` | `6379` | `redis-cli ping` |
| `yt-studio-n8n` | n8n Engine | `5678` | `5678` | `wget -q --spider http://localhost:5678/healthz` |

---

## 5. Development Workflow & Commands

Run all services concurrently using Turborepo:

```bash
# Run all apps in development mode (API, Worker, Web)
pnpm run dev

# Run individual workspaces if preferred:
pnpm --filter @yt-studio/api dev      # Express API on http://localhost:4000
pnpm --filter @yt-studio/web dev      # Vite React on http://localhost:3000
pnpm --filter @yt-studio/worker dev   # BullMQ Worker background daemon
```

### 5.1 Verification & Quality Pipeline
Every phase and PR must pass the automated quality gates:

```bash
# Run ESLint across all workspaces
pnpm run lint

# Run TypeScript type check in strict mode
pnpm run type-check

# Run full Vitest automated test suite
pnpm run test

# Run Docker Compose and CI schema validators
pnpm run test:compose
pnpm run test:ci

# Build all packages and web assets for production
pnpm run build
```

---

## 6. Service Port Allocations

| Subsystem | Port | URL / Endpoint | Purpose |
| :--- | :--- | :--- | :--- |
| **Web Frontend** | `3000` | `http://localhost:3000` | React + Vite UI (Stitch components) |
| **Express API** | `4000` | `http://localhost:4000/api/v1` | Core REST API & Webhook listener |
| **API Health** | `4000` | `http://localhost:4000/api/v1/health` | Memory, uptime, & service diagnostics |
| **n8n Automation** | `5678` | `http://localhost:5678` | Visual automation canvas & webhook runner |
| **MongoDB** | `27017` | `mongodb://localhost:27017` | Primary datastore (replica set `rs0`) |
| **Redis** | `6379` | `redis://localhost:6379` | Cache, rate limiter & BullMQ queues |

---

## 7. Troubleshooting & Common Pitfalls

### Issue A: MongoDB Transaction Failures (`This operation requires a replica set`)
* **Cause:** The MongoDB instance was started without replica set initialization.
* **Fix:** Verify `docker-compose.yml` has `command: ["--replSet", "rs0", "--bind_ip_all"]`. Re-run initialization:
  ```bash
  docker exec -it yt-studio-mongo mongosh --eval "rs.status().ok || rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'mongo:27017' }] })"
  ```

### Issue B: BullMQ Job Loss under Memory Pressure
* **Cause:** Default Redis policy evicts keys randomly (`volatile-lru`).
* **Fix:** The provided `infra/docker/redis.conf` sets `maxmemory-policy noeviction`. Never run BullMQ against Redis with key eviction enabled.

### Issue C: Invalid `TOKEN_ENCRYPTION_KEY_HEX` on Boot
* **Cause:** The encryption key in `.env` is not exactly 64 hexadecimal characters.
* **Fix:** Run `openssl rand -hex 32` and paste the exact output into `TOKEN_ENCRYPTION_KEY_HEX`.
