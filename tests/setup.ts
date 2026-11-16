// Runs in each test file's worker.
import { afterAll, beforeEach } from "vitest";
import { sequelize } from "../src/db/sequelize.js";
import { seedDatabase } from "../src/db/seed-data.js";

// Every test starts from the same seeded data (stable ids, see tests/helpers.ts).
beforeEach(async () => {
  await seedDatabase();
});

afterAll(async () => {
  await sequelize.close();
});