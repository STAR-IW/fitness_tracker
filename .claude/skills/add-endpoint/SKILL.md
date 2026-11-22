---
name: add-endpoint
description: Use when adding a new API endpoint to the coaching API. Covers validation, ownership, error codes and tests.
---

1. Read project-scope.md for the endpoint's rules (who is allowed, what it returns).
2. Validate req.params and req.body with Zod in the route. Use only parsed.data.
3. Identity only from req.user. Never from the body.
4. Ownership inside the DB query (where includes owner + organizationId). Not found or not owner → 404.
5. Business logic in src/services/, HTTP only in src/routes/.
6. Add integration tests in tests/: 201/200, 401, 403, 404, 400.
7. Run npm run typecheck and npm test. Stop and show the diff. Don't commit.
