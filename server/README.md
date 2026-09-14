# Global Recycle — Python Backend

A FastAPI backend serving the Recycle Compass / Global Recycle data: jurisdictions,
recycling rules, pickup calendars, drop-off centers, user auth, and scan history.
It reads/writes the PostgreSQL database defined in [`../DB/schema.sql`](../DB/schema.sql).

## Tech Stack

- **Python 3.12+**
- **FastAPI** — async REST API framework
- **SQLAlchemy 2.0 (async)** + **asyncpg** — database access
- **Pydantic v2** — request/response validation
- **python-jose** — JWT access/refresh tokens
- **bcrypt** — password hashing (compatible with the `pgcrypto` bcrypt hashes used in `schema.sql`)

## Project Layout

```
server/
  requirements.txt
  .env.example
  app/
    main.py          # FastAPI app entrypoint
    config.py         # Settings loaded from environment / .env
    database.py        # Async SQLAlchemy engine + session
    models.py          # ORM models mapped to DB/schema.sql tables
    schemas.py          # Pydantic request/response models
    security.py         # Password hashing + JWT helpers
    deps.py              # FastAPI dependencies (current user, etc.)
    routers/
      auth.py            # POST /auth/register, /auth/login, /auth/refresh
      jurisdictions.py    # GET /jurisdictions, /jurisdictions/{id}
      rules.py             # GET /rules/{jurisdiction_id}
      calendar.py          # GET /calendar/{jurisdiction_id}
      centers.py            # GET /centers (geospatial search), /centers/{id}
      history.py            # GET/POST /history, GET /history/impact (auth required)
```

## Setup

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env if your DB host/port/credentials differ
```

### Database

This backend expects the database created from [`DB/schema.sql`](../DB/schema.sql) and
optionally [`DB/seed.sql`](../DB/seed.sql) to already exist. It does **not** create tables
itself — `schema.sql` is the single source of truth for the schema.

By default `.env.example` points to:
```
postgresql+asyncpg://padmaja@127.0.0.1:5433/recycle
```
Update `DATABASE_URL` to match your local Postgres instance/port/user.

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

- Interactive API docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

## Authentication

- `POST /auth/register` — create an account with email + password (bcrypt-hashed, stored in `users.password_hash`)
- `POST /auth/login` — returns `access_token` (short-lived) and `refresh_token` (long-lived)
- `POST /auth/refresh` — exchange a refresh token for a new token pair
- Protected endpoints (e.g. `/history`) require `Authorization: Bearer <access_token>`

## Notes

- Passwords are hashed with the `bcrypt` Python package, which produces standard bcrypt
  strings (`$2b$...`) — the same format PostgreSQL's `pgcrypto` `crypt()`/`gen_salt('bf')`
  produces, so hashes are interchangeable between the app and raw SQL tooling.
- Drop-off center search (`GET /centers`) uses PostGIS's `ST_DistanceSphere` for
  distance-based filtering and sorting, matching the GIST spatial index defined in `schema.sql`.
- See [`docs/API_DESIGN.md`](../docs/API_DESIGN.md) for the full planned API surface;
  this backend implements the data-serving subset (auth, jurisdictions, rules, calendar,
  centers, history). Vision/AI analysis endpoints are out of scope for this service.
