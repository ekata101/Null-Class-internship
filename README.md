# Combined App (SQLite Edition)

A full-stack web app with Auth, OTP verification, Q&A with AI answers, and Subscription/Payment — now using **SQLite** instead of MySQL.

## Stack

- **Backend**: Node.js + Express (ESM)
- **Database**: SQLite via `better-sqlite3` (file-based, zero config)
- **Frontend**: Vanilla HTML/CSS/JS

## Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your JWT secret and (optionally) email credentials
node server.js
```

The SQLite database file (`db/app.db`) is **auto-created** on first run — no setup needed.

## Project Structure

```
combined-project/
├── db/
│   ├── schema.sql       # SQLite schema (auto-applied on startup)
│   └── app.db           # SQLite database file (auto-created)
├── backend/
│   ├── config/db.js     # SQLite connection via better-sqlite3
│   ├── controllers/     # Auth, OTP, Questions, Payment
│   ├── routes/          # Express route definitions
│   ├── middlewares/     # JWT auth middleware
│   └── server.js        # Express app entry point
└── frontend/            # HTML pages + CSS + JS
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | ❌ | Register user |
| POST | /api/auth/login | ❌ | Login & get JWT |
| GET | /api/auth/profile | ✅ | Get user profile |
| POST | /api/auth/forgot-password | ❌ | Reset password |
| POST | /api/otp/send | ❌ | Send OTP |
| POST | /api/otp/verify | ❌ | Verify OTP |
| POST | /api/questions/ask | ✅ | Ask a question |
| POST | /api/payment/pay | ✅ | Upgrade subscription plan |

## Migration from MySQL

Key changes made:
- Replaced `mysql2` with `better-sqlite3`
- All DB calls are now **synchronous** (no `async/await` for queries)
- `CURDATE()` → `DATE('now')`, `NOW()` → `datetime('now')`
- `AUTO_INCREMENT` → `INTEGER PRIMARY KEY AUTOINCREMENT`
- `ENUM` → `TEXT CHECK(...)` constraint
- Schema auto-runs on startup via `db.exec(schema)`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_PATH` | Path to SQLite file | `./db/app.db` |
| `JWT_SECRET` | JWT signing secret | `secret123` |
| `EMAIL_USER` | Gmail address for SMTP | — |
| `EMAIL_PASS` | Gmail app password | — |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
