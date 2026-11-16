// Resets all app data and inserts demo orgs, users and the exercise catalog.
// Usage: npm run db:seed   (refuses to run when NODE_ENV=production)
import { config } from "../config.js";

if (config.NODE_ENV === "production") {
  console.error("Refusing to seed: NODE_ENV is production. The seed wipes all data.");
  process.exit(1);
}

const { sequelize } = await import("./sequelize.js");
const { EXERCISES, seedDatabase } = await import("./seed-data.js");
const { User } = await import("../models/index.js");

try {
  await seedDatabase();

  const users = await User.findAll({ order: [["id", "ASC"]] });
  console.log(`Seeded ${EXERCISES.length} exercises and ${users.length} users:`);
  console.table(
    users.map((u) => ({ id: u.id, org: u.organizationId, role: u.role, coachId: u.coachId, name: u.name })),
  );
} finally {
  await sequelize.close();
}