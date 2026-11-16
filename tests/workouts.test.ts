import { describe, it, expect } from "vitest";
import { api, USERS } from "./helpers.js";

const validBody = { focus: "chest", performedAt: "2026-11-16T18:30:00Z" };

describe("POST /workouts", () => {
    it("creates a workout for the logged-in trainee", async () => {
        const res = await api()
            .post("/workouts")
            .set("x-user-id", String(USERS.traineeA1))
            .send(validBody);

        expect(res.status).toBe(201);
        expect(res.body.traineeId).toBe(USERS.traineeA1);
    });

    it("returns 403 for a coach", async () => {
        const res = await api()
            .post("/workouts")
            .set("x-user-id", String(USERS.coachA))
            .send(validBody);

        expect(res.status).toBe(403);
    });
    it("returns 401 without a user header", async () => {
        const res = await api()
            .post("/workouts")
            .send(validBody);

        expect(res.status).toBe(401);
    });
    it("returns 400 for an invalid focus", async () => {
        const res = await api()
            .post("/workouts")
            .set("x-user-id", String(USERS.traineeA1))
            .send({ traineeId:USERS.traineeB1, focus: "PIZZA_PARTY", performedAt: "2026-11-16T18:30:00Z" });

        expect(res.status).toBe(400);
    });
    it("ignores traineeId in the body and uses the logged-in user ", async () => {
        const res = await api()
            .post("/workouts")
            .set("x-user-id", String(USERS.traineeA1))
            .send({ traineeId:USERS.traineeB1, focus: "chest", performedAt: "2026-11-16T18:30:00Z" });

        expect(res.status).toBe(201);
        expect(res.body.traineeId).toBe(USERS.traineeA1);
        expect(res.body.traineeId).not.toEqual(USERS.traineeB1);

    });


});