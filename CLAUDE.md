# CLAUDE.md

Remote coaching API: trainees log workouts and sets; their coach views and comments.
Product scope, endpoint rules and roadmap live in `project-scope.md`. Read it before adding features,
and ask before making any decision it doesn't cover.

## Commands
```bash
docker compose up -d          # Postgres (host port 5433) + pgAdmin (http://localhost:5050)
npm run dev                   # tsx watch, http://localhost:3000
npm run typecheck             # tsc --noEmit
npm run build && npm start    # compile to dist/ and run
npm run db:migrate            # apply pending migrations
npm run db:migrate:undo       # revert last one; `-- --to 0` reverts all
npm run db:migrate:status     # list pending
npm run db:seed               # WIPES all tables, inserts demo data; refuses if NODE_ENV=production
```
Seeded user ids: 1 Coach A, 2 Trainee A1 (coached by 1), 3 Trainee A2 (no coach) in org 1;
4 Coach B, 5 Trainee B1 (coached by 4) in org 2. 12 exercises.

## Stack
Express 5, TypeScript (ESM, `"type": "module"`, NodeNext), Sequelize 6, Postgres 16, Umzug 3, Zod 4.
Node >= 22. Tests (planned): Vitest + Supertest.

## Layout
- `src/server.ts` starts the app; `src/app.ts` exports `createApp()` (no `listen`, for Supertest).
- `src/config.ts` loads `.env` and validates it with Zod. Use `config`, never read `process.env` directly.
- `src/routes/` HTTP only → `src/services/` logic → `src/models/` DB. Keep this layering.
- `src/db/sequelize.ts` single Sequelize instance; `src/db/umzug.ts` migrator; `src/db/migrations/` schema.

## Conventions
- Relative imports use the `.js` extension (`./app.js`), even from `.ts` files.
- DB columns are snake_case; model attributes camelCase (`underscored: true`). `createdAt` only, no `updatedAt`.
- Schema changes go through a new numbered migration (`0007-...ts`) with a working `down`.
  Never edit an applied migration. Never call `sequelize.sync()`.
- Migrations hard-code their enum values; don't import from `src/models/enums.ts` (migrations are snapshots).
  A `down` that drops a table with an ENUM must also `DROP TYPE "enum_<table>_<column>"`.
- The `sets` table's model is `WorkoutSet` (avoids JS `Set`). `weightKg` is DECIMAL; its getter returns a number.
- Errors use `{ error: { code, message } }`.

## Rules (from project-scope.md)
- Identity and organizationId come only from `req.user`, never from the request body.
- Middleware order: auth → role → Zod → ownership query.
- 401 not logged in, 403 wrong role, 400 Zod failure, 404 not owner (ownership is checked in the DB query).

## Gotchas
- A local Windows Postgres owns port 5432, so the container is mapped to **5433**.
- Inside Docker (pgAdmin), the DB host is `db:5432`; from the host it's `localhost:5433`. Password: `track`.
