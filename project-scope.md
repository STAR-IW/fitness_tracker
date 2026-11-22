# Remote Coaching App — Stage 1 Plan

## Product
Coaches follow trainees remotely. Web app: mobile-first for trainees, desktop for coaches.
Coach is optional. MVP: trainee logs workouts and sets; coach views and comments.
Later: programs, PRs + notifications (queue), live feed (Socket.IO), nutrition.

## Stack
Express, TypeScript, Sequelize, Postgres (docker-compose), Zod, Vitest + Supertest.
Layers: routes (HTTP only) → services (logic) → models (DB).
Sequelize migrations + seed script. `.env` validated with Zod at startup.

## Auth (Stage 1)
Dev middleware reads the `x-user-id` header, loads the user and sets `req.user`. Missing or unknown → 401.
JWT later.

## Seed
The seed script creates orgs, coaches, trainees (with coachId) and the global exercise list.
No org or invite endpoints in Stage 1.

## Tables (all ids int, all have createdAt)
organizations: id, name
users: id, organizationId, name, email (unique), role enum(coach, trainee), coachId nullable
workouts: id, organizationId, traineeId, focus enum(chest, back, legs, shoulders, arms, fullbody), performedAt timestamptz
exercises: id, name (string, unique), muscleGroup enum. Global (no organizationId), seeded.
sets: id, workoutId, exerciseId, setNumber, reps, weightKg decimal
  - unique (workoutId, exerciseId, setNumber)
  - check reps > 0, weightKg >= 0
  - weightKg is parsed to a number before leaving the service (Sequelize returns DECIMAL as string)
comments: id, workoutId, authorId, body (max 1000 chars)

Foreign keys: ON DELETE CASCADE from workouts to sets and comments.
Indexes: workouts(traineeId, performedAt), workouts(organizationId), sets(workoutId), sets(exerciseId),
comments(workoutId), comments(authorId), users(coachId), users(organizationId)

## Endpoints
GET  /health                       no auth → 200
POST /workouts                     trainee only (403 otherwise). traineeId from req.user. → 201
POST /workouts/:workoutId/sets     owner trainee only. coach → 403, other → 404. → 201 + set
GET  /workouts/:workoutId          owner trainee or their coach, else 404.
                                   Returns the workout + sets (with exercise names) + comments.
GET  /trainees                     coach: own trainees only
GET  /trainees/:traineeId/workouts the trainee or their coach, else 404.
                                   Cursor pagination, ordered by performedAt desc.
POST /workouts/:workoutId/comments owner trainee or their coach, else 404 → 201 + comment
GET  /exercises                    any logged-in user, else 401

## Rules
- Identity only from auth (req.user), never from body. organizationId always from req.user.
- Middleware order: auth → role → Zod → ownership query.
- Role check in middleware; ownership in the DB query (where includes owner + organizationId).
- Not logged in → 401. Wrong role → 403. Zod failure on the body → 400. Not owner → 404.
- Invalid path param (e.g. `/workouts/abc/sets`) → 404: a malformed id means the resource doesn't exist.
- Unknown body fields are ignored (stripped by Zod), not rejected. Services map fields explicitly,
  so extra keys can never reach the DB.
- Error shape: { error: { code, message } }

## Tests (Stage 1)
Vitest + Supertest integration tests against Postgres covering the 401/403/404 rules.

## Roadmap
1. API: orgs, users, workouts, sets, comments. Zod, auth, ownership, integration tests.  ← current
2. Idempotency-Key on logging a set. Outbox + queue to compute PRs.
3. Socket.IO: coach sees new sets and PRs live.
4. React: trainee logging screen, coach dashboard.
5. README, docker-compose for everything.
   Later: JWT auth, programs, nutrition.

## Deferred
- Edit/delete sets
- Workout notes
- Date filters on workout lists
- Request logging
- Bodyweight/timed exercises
