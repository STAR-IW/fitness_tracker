import request from "supertest";
import { createApp } from "../src/app.js";

/** Supertest agent for the real app. Send `x-user-id` with `.set("x-user-id", String(USERS.traineeA1))`. */
export const api = () => request(createApp());

/** Seeded user ids (stable: the seed restarts identities). */
export const USERS = {
  coachA: 1,
  traineeA1: 2, // coached by coachA
  traineeA2: 3, // org A, no coach
  coachB: 4,
  traineeB1: 5, // org B, coached by coachB
} as const;