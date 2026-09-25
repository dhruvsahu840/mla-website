# MLA Constituency Website — Monorepo

Built per `MLA_Website_Master_Specification.pdf`. Full stack: Next.js (frontend) + Express (API) + Prisma + MySQL.

## What's built so far

- **Monorepo scaffold**: `apps/web` (Next.js 16, TS, Tailwind v4), `apps/api` (Express + TS), `packages/validation` (shared Zod schemas), `prisma/schema.prisma` (full data model).
- **Public website**: Home, About, Constituency, Development Works, Schemes, Events, Gallery, News (list + detail), Grievance (submit + track), Contact — all wired to the API.
- **Admin Dashboard** (`/admin`):
  - Login page — one form, two roles: **ADMIN** (MLA / super-admin, full access) and **STAFF** (limited — grievances & news, no settings or staff management).
  - Dashboard overview with live stats (grievance counts, post counts, contact messages).
  - Grievance management — list with status filters, detail page with status-update + citizen-visible comment history.
  - News management — list, create, edit, publish/draft, delete (delete is ADMIN-only).
  - Staff management (ADMIN-only) — create new ADMIN/STAFF accounts, enable/disable accounts.
  - Site Settings (ADMIN-only) — configurable: MLA name, tagline, constituency name, phone, email, address, office hours, social links. Editing here updates what's shown on the public site.
- **API**: full REST routes for auth, grievances, contact, posts, settings, dashboard stats — rate limiting, Helmet, CORS, Zod validation, JWT + HttpOnly cookies, bcrypt password hashing, role-based route protection.

## Not yet built

- Remaining CRUD admin screens for Development Works, Schemes, Events, Gallery (currently public pages show static sample data — you mentioned you'll share advanced feature requirements later).
- Media/image upload (Cloudinary or S3).
- Maps embed, email/SMS notifications, Sentry monitoring, automated tests, CI/CD, deployment config.

## Running it locally

**Prerequisites**: Node 20+ (Node 22 or 24 recommended — this project will NOT install correctly on Node 18), and a MySQL database (local install, or a free hosted one from Railway/PlanetScale).

```bash
# 1. Install deps (from repo root)
npm install

# 2. Configure environment
cp .env.example apps/api/.env
# edit apps/api/.env -> set a real DATABASE_URL pointing to your MySQL instance
cp .env.example apps/web/.env.local
# edit apps/web/.env.local -> keep NEXT_PUBLIC_API_URL=http://localhost:4000

# 3. Generate Prisma client & run migrations
cd apps/api
npx prisma generate --schema=../../prisma/schema.prisma
npx prisma migrate dev --schema=../../prisma/schema.prisma --name init

# 4. Seed the first ADMIN and STAFF accounts
npm run seed
# This prints login credentials to the terminal, e.g.:
#   ADMIN -> email: admin@example.com  password: Admin@12345
#   STAFF -> email: staff@example.com  password: Staff@12345
# Change these passwords after first login. You can also set your own via
# SEED_ADMIN_PASSWORD / SEED_STAFF_PASSWORD environment variables before seeding.

# 5. Run both apps (separate terminals)
npm run dev --workspace=apps/api   # http://localhost:4000
npm run dev --workspace=apps/web   # http://localhost:3000
```

Then visit:
- **http://localhost:3000** — public website
- **http://localhost:3000/admin/login** — admin dashboard login

## Folder structure

```
mla-website/
├── apps/
│   ├── web/     Next.js public website + admin dashboard (app/admin/*)
│   └── api/     Express API
├── packages/
│   └── validation/   shared Zod schemas
├── prisma/
│   └── schema.prisma
├── .env.example
└── README.md
```
