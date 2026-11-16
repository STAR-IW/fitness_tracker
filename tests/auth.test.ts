import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { auth } from "../src/middleware/auth.js";
import { requireRole } from "../src/middleware/require-role.js";
import { USERS } from "./helpers.js";

// Throwaway app: real auth + role middleware in front of a dummy route.
const app = express();
app.get("/trainee-only", auth, requireRole("trainee"), (req, res) => {
  res.json({ user: req.user });
});

const get = (userId?: string) => {
  const req = request(app).get("/trainee-only");
  return userId === undefined ? req : req.set("x-user-id", userId);
};

describe("auth middleware", () => {
  it.each([
    ["missing header", undefined],
    ["non-numeric id", "abc"],
    ["unknown id", "999"],
    ["id outside INTEGER range", "99999999999"],
  ])("returns 401 for %s", async (_label, userId) => {
    const res = await get(userId);

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("sets req.user from the database", async () => {
    const res = await get(String(USERS.traineeA1));

    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({
      id: USERS.traineeA1,
      role: "trainee",
      organizationId: 1,
      coachId: USERS.coachA,
    });
  });
});

describe("requireRole middleware", () => {
  it("returns 403 for a logged-in user with the wrong role", async () => {
    const res = await get(String(USERS.coachA));

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });
});