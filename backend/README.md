# Multi-tenant Store — Backend API

FastAPI REST API for a multi-tenant store platform. Handles authentication via Supabase, product catalog, image uploads to Cloudinary, full-text search with Meilisearch, and push notifications via Expo.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI + Uvicorn |
| Database | Supabase (PostgreSQL) |
| ORM / Migrations | SQLAlchemy 2.x async + Alembic |
| Auth | Supabase Auth (JWT verification with PyJWT) |
| Image Storage | Cloudinary |
| Search | Meilisearch |
| Cache / Queue | Redis + Celery |
| Push Notifications | Expo Push API |
| Monitoring | Sentry |

---

## Prerequisites

- Python 3.12+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Redis and Meilisearch)
- A [Supabase](https://supabase.com) project (free tier is enough)
- A [Cloudinary](https://cloudinary.com) account (free tier is enough)

---

## Quick Start

### 1. Clone and enter the backend folder

```bash
cd backend
```

### 2. Create and activate virtual environment

```bash
# Create
python -m venv .venv

# Activate — macOS / Linux
source .venv/bin/activate

# Activate — Windows PowerShell
.venv\Scripts\Activate.ps1

# Activate — Windows CMD
.venv\Scripts\activate.bat

# Verify (should point to .venv)
which python
```

### 3. Install dependencies

```bash
pip install -r requirements.txt

# Or using make
make install
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# App
APP_NAME="Multi-tenant Store API"
DEBUG=true

# Supabase — from Dashboard → Project Settings → API
SUPABASE_URL=https://xyzxyzxyz.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret        # Settings → API → JWT Secret

# Database — from Dashboard → Project Settings → Database → Connection string
DATABASE_URL=postgresql+asyncpg://postgres:[password]@db.[ref].supabase.co:5432/postgres

# Redis (local via Docker)
REDIS_URL=redis://localhost:6379/0

# Cloudinary — from Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Meilisearch (local via Docker)
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_API_KEY=masterkey

# CORS
ALLOWED_ORIGINS=["http://localhost:8081","http://localhost:3000"]
```

> **Security note:** Never commit `.env`. It is already listed in `.gitignore`.

### 5. Start local services (Redis + Meilisearch)

```bash
docker-compose up -d

# Verify services are running
docker-compose ps
```

Services available at:
- Redis: `localhost:6379` — no HTTP interface, use the commands below to verify
- Meilisearch: `http://localhost:7700`

> **Note:** Redis does not have a browser interface. Opening `http://localhost:6379` will show nothing — that is normal. Use one of these to confirm it is running:
>
> ```bash
> # Option 1 — via Docker (recommended)
> docker exec -it $(docker ps -qf "name=redis") redis-cli ping
> # Expected: PONG
>
> # Option 2 — if redis-cli is installed locally
> redis-cli -h localhost -p 6379 ping
> # Expected: PONG
>
> # Option 3 — via Python (with venv active)
> python -c "import redis; print(redis.Redis().ping())"
> # Expected: True
> ```

### 6. Run database migrations

> **Make sure your virtual environment is activated before running any of these commands.** You should see `(.venv)` at the start of your terminal prompt. If not, activate it first:
>
> ```powershell
> # Windows PowerShell
> .venv\Scripts\Activate.ps1
>
> # macOS / Linux
> source .venv/bin/activate
> ```
>
> If PowerShell blocks the script with an execution policy error, run this once:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

First, install the synchronous PostgreSQL driver that Alembic requires:

```bash
pip install psycopg2-binary
```

Then run **both steps** in order — skipping step 1 means Alembic has no migration files and only the `alembic_version` table will be created:

```bash
# STEP 1 — Generate the migration file from your models
#          (creates a file under app/db/migrations/versions/)
alembic revision --autogenerate -m "initial tables"

# STEP 2 — Apply the migration to Supabase
alembic upgrade head
```

> **Important:** `alembic upgrade head` alone does NOT create your tables. It only applies migration files that already exist. You must run `alembic revision --autogenerate` first to generate those files from your models, then run `alembic upgrade head` to apply them.

After running both commands you should see all tables (tenants, users, categories, products, etc.) in your Supabase dashboard under **Table Editor**.

```bash
# Or using make (applies only — still requires step 1 first)
make migrate
```

This creates all tables in your Supabase PostgreSQL database.

> **Note:** The venv must be activated every time you open a new terminal. All commands — `alembic`, `uvicorn`, `pytest`, `celery` — only work inside the activated environment.

### 7. Seed demo data

> **Prerequisites — all three must be done before seeding:**
> 1. **Migrations applied** — tables must exist (`alembic upgrade head` from step 6)
> 2. **`.env` configured** — `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `DATABASE_URL` must be set (step 4)
> 3. **Venv activated** — `(.venv)` must appear in your prompt (step 2)
>
> The seeder inserts rows into the DB **and** calls Supabase Auth API to create the demo user. If either is unreachable it will fail.

```bash
python -m app.db.seeds.runner

# Or using make
make seed
```

This creates:
- 1 demo tenant (`demo-store`)
- 1 owner user (`owner@demo.com` / `demo1234`) — created in Supabase Auth + `public.users`
- 5 categories (Ropa, Calzado, Accesorios, Electrónica, Hogar)
- 10 sample products

### 8. Start the development server

```bash
uvicorn app.main:app --reload --port 8000

# Or using make
make dev
```

The API is now available at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health check:** http://localhost:8000/health

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                  # App bootstrap, middleware, routes
│   ├── core/
│   │   ├── config.py            # Settings (pydantic-settings, reads .env)
│   │   ├── security.py          # Supabase JWT verification
│   │   ├── dependencies.py      # get_db, get_current_user, require_role
│   │   ├── exceptions.py        # Domain exceptions (NotFoundError, etc.)
│   │   ├── context.py           # ContextVar for tenant per request
│   │   └── logging.py           # Logging setup
│   ├── middleware/
│   │   ├── tenant.py            # Resolves tenant from X-Tenant-Slug header
│   │   ├── logging.py           # Request logging (method, path, duration)
│   │   └── rate_limit.py        # Per-tenant rate limiting via Redis
│   ├── api/v1/
│   │   ├── router.py            # Registers all routers
│   │   ├── auth.py              # POST /auth/sync, GET /auth/me
│   │   ├── tenants.py           # GET/PUT /tenants/me
│   │   ├── categories.py        # CRUD /categories
│   │   ├── products.py          # CRUD /products
│   │   ├── images.py            # POST /products/{id}/images/sign, register, delete
│   │   ├── inventory.py         # Stock adjust, movements, low-stock
│   │   ├── search.py            # GET /search
│   │   ├── orders.py            # CRUD /orders
│   │   └── notifications.py     # Push tokens, list, mark-read
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── services/                # Business logic layer
│   ├── infrastructure/          # External adapters (Supabase, Cloudinary, etc.)
│   ├── tasks/                   # Celery background tasks
│   ├── helpers/                 # Pure utility functions
│   └── db/
│       ├── session.py           # AsyncSessionLocal factory
│       ├── migrations/          # Alembic migrations
│       └── seeds/               # Demo data seeders
├── tests/
├── .env.example
├── alembic.ini
├── docker-compose.yml
├── Makefile
└── requirements.txt
```

---

## API Reference

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication

All protected endpoints require:
```
Authorization: Bearer <supabase_access_token>
X-Tenant-Slug: your-tenant-slug
```

The `access_token` is issued by Supabase Auth — the mobile app gets it after login via `supabase-js`.

### Endpoints Overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | No | Health check |
| `POST` | `/auth/sync` | JWT | Sync user after Supabase registration |
| `GET` | `/auth/me` | JWT | Current user profile |
| `GET` | `/tenants/me` | JWT | My store info |
| `PUT` | `/tenants/me` | Owner | Update store |
| `PUT` | `/tenants/me/settings` | Owner | Update store settings |
| `GET` | `/tenants/me/stats` | JWT | Store stats |
| `GET` | `/categories` | JWT | List categories |
| `POST` | `/categories` | Owner | Create category |
| `PUT` | `/categories/{id}` | Owner | Update category |
| `DELETE` | `/categories/{id}` | Owner | Delete category |
| `GET` | `/products` | Staff | List products (paginated) |
| `POST` | `/products` | Staff | Create product |
| `GET` | `/products/{id}` | Staff | Get product |
| `PUT` | `/products/{id}` | Staff | Update product |
| `DELETE` | `/products/{id}` | Owner | Soft-delete product |
| `PATCH` | `/products/{id}/toggle` | Staff | Toggle active status |
| `POST` | `/products/{id}/duplicate` | Staff | Duplicate product |
| `POST` | `/products/{id}/images/sign` | Staff | Get Cloudinary upload signature |
| `POST` | `/products/{id}/images` | Staff | Register uploaded image |
| `DELETE` | `/products/{id}/images/{img_id}` | Staff | Delete image |
| `PATCH` | `/products/{id}/images/reorder` | Staff | Reorder images |
| `POST` | `/inventory/adjust` | Staff | Adjust stock +/- |
| `GET` | `/inventory/movements` | Staff | Stock movement history |
| `GET` | `/inventory/low-stock` | Staff | Products below threshold |
| `GET` | `/search?q=...` | JWT | Full-text product search |
| `GET` | `/search/suggestions?q=...` | JWT | Autocomplete suggestions |
| `GET` | `/orders` | Staff | List orders |
| `POST` | `/orders` | Staff | Create order |
| `GET` | `/orders/{id}` | Staff | Get order detail |
| `PATCH` | `/orders/{id}/status` | Staff | Update order status |
| `POST` | `/notifications/push-token` | JWT | Register Expo push token |
| `GET` | `/notifications` | JWT | List my notifications |
| `PATCH` | `/notifications/{id}/read` | JWT | Mark notification as read |

### Roles

| Role | Access |
|------|--------|
| `superadmin` | Everything |
| `owner` | Full access to own tenant |
| `staff` | Read + create + update (no delete, no settings) |

---

## Image Upload Flow

Images are uploaded directly to Cloudinary from the mobile app using a signed request.

```
1. Mobile → POST /products/{id}/images/sign
           ← { signature, timestamp, cloud_name, folder }

2. Mobile → POST https://api.cloudinary.com/v1_1/{cloud}/image/upload
            (multipart form with signature)
           ← { secure_url, public_id }

3. Mobile → POST /products/{id}/images
            { cloudinary_id, url }
           ← ProductImage object
```

---

## Database Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Create a new migration (after changing models)
alembic revision --autogenerate -m "add_column_to_products"

# Or using make (prompts for migration name)
make migrate-new

# See migration history
alembic history

# Rollback last migration
alembic downgrade -1

# Rollback everything
alembic downgrade base

# Preview SQL without applying
alembic upgrade head --sql
```

> Alembic uses a **synchronous** PostgreSQL connection for migrations (psycopg2), while the app uses asyncpg. The `env.py` handles this automatically.

---

## Running Tests

```bash
# Run all tests
pytest tests/ -v

# With coverage report
pytest tests/ -v --cov=app --cov-report=term-missing

# Run a specific test file
pytest tests/test_products.py -v

# Run a specific test
pytest tests/test_health.py::test_health_check -v

# Or using make
make test
```

Tests use an in-memory SQLite database — no Supabase connection needed.

---

## Background Tasks (Celery)

```bash
# Start a Celery worker (in a separate terminal, with venv activated)
celery -A app.tasks.celery_app worker --loglevel=info

# Monitor tasks (optional)
celery -A app.tasks.celery_app flower
```

Tasks available:
- `search.index_product` — indexes a product in Meilisearch
- `search.delete_product` — removes a product from Meilisearch
- `images.delete_from_cloudinary` — deletes an image from Cloudinary
- `notifications.send_push` — sends Expo push notifications

---

## Makefile Commands

```bash
make install       # pip install -r requirements.txt
make dev           # uvicorn with --reload on port 8000
make migrate       # alembic upgrade head
make migrate-new   # create a new migration (interactive)
make seed          # run demo data seeders
make test          # pytest with coverage
make lint          # ruff + mypy
make services-up   # docker-compose up -d
make services-down # docker-compose down
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_NAME` | No | App name shown in Swagger |
| `DEBUG` | No | Enable Swagger UI + verbose SQL (default: false) |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase private key (server-only) |
| `SUPABASE_JWT_SECRET` | Yes | JWT secret for token verification |
| `DATABASE_URL` | Yes | PostgreSQL async connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `MEILISEARCH_URL` | No | Meilisearch URL (default: localhost:7700) |
| `MEILISEARCH_API_KEY` | No | Meilisearch master key |
| `EXPO_ACCESS_TOKEN` | No | Expo push token for notifications |
| `ALLOWED_ORIGINS` | No | JSON array of allowed CORS origins |
| `SENTRY_DSN` | No | Sentry DSN for error tracking |

---

## Common Issues

### `ModuleNotFoundError` when running Alembic

Make sure you run Alembic from the `backend/` directory with the venv activated:
```bash
cd backend
source .venv/bin/activate
alembic upgrade head
```

### `Connection refused` on Redis or Meilisearch

Make sure Docker services are running:
```bash
docker-compose up -d
docker-compose ps   # check status
```

**Redis has no browser interface** — `http://localhost:6379` will always appear empty. That is not an error. Verify Redis is working with:
```bash
docker exec -it $(docker ps -qf "name=redis") redis-cli ping
# Expected: PONG
```

### `Invalid token` on protected endpoints

The `Authorization` header must be a valid Supabase JWT. In development, get one via:
```bash
# Using Supabase CLI or the Supabase Dashboard → Authentication → Users → Copy JWT
```
Or log in from the mobile app and copy the token from the Redux store.

### Alembic detects no changes

Make sure all model files are imported in `app/db/migrations/env.py`. Each model must be imported so Alembic can detect the tables.

### `seed_users` fails with Supabase Auth error

If the Supabase Auth user already exists or credentials are wrong, the seeder catches the error and generates a random UUID instead. You can manually create the user in Supabase Dashboard → Authentication → Users.

---

## Deployment

### Railway (recommended)

1. Connect your GitHub repo to Railway
2. Add a new service pointing to the `backend/` folder
3. Set all environment variables from `.env.example`
4. Railway auto-detects `uvicorn` from the `Procfile` (create if needed):
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Fly.io

```bash
fly launch
fly secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... # etc.
fly deploy
```

### Production checklist

```
[ ] DEBUG=false (hides /docs and /redoc)
[ ] ALLOWED_ORIGINS points to production mobile/web domains
[ ] SUPABASE_SERVICE_ROLE_KEY stored as secret, not in code
[ ] Sentry DSN configured
[ ] Redis and Meilisearch on managed services (not local Docker)
[ ] alembic upgrade head run after each deploy
```
