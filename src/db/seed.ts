// Resets all app data and inserts demo orgs, users and the exercise catalog.
// Usage: npm run db:seed   (refuses to run when NODE_ENV=production)
import { config } from "../config.js";

if (config.NODE_ENV === "production") {
  console.error("Refusing to seed: NODE_ENV is production. The seed wipes all data.");
  process.exit(1);
}

const { sequelize } = await import("./sequelize.js");
const { Exercise, Organization, User } = await import("../models/index.js");

const EXERCISES = [
  { name: "Bench Press", muscleGroup: "chest" },
  { name: "Incline Dumbbell Press", muscleGroup: "chest" },
  { name: "Deadlift", muscleGroup: "back" },
  { name: "Barbell Row", muscleGroup: "back" },
  { name: "Lat Pulldown", muscleGroup: "back" },
  { name: "Back Squat", muscleGroup: "legs" },
  { name: "Romanian Deadlift", muscleGroup: "legs" },
  { name: "Overhead Press", muscleGroup: "shoulders" },
  { name: "Lateral Raise", muscleGroup: "shoulders" },
  { name: "Barbell Curl", muscleGroup: "arms" },
  { name: "Triceps Pushdown", muscleGroup: "arms" },
  { name: "Cable Crunch", muscleGroup: "core" },
] as const;

try {
  await sequelize.transaction(async (transaction) => {
    await sequelize.query(
      "TRUNCATE comments, sets, workouts, exercises, users, organizations RESTART IDENTITY CASCADE",
      { transaction },
    );

    await Exercise.bulkCreate([...EXERCISES], { transaction });

    // Org A: a coach, a coached trainee and a trainee without a coach.
    const orgA = await Organization.create({ name: "Org A" }, { transaction });
    const coachA = await User.create(
      { organizationId: orgA.id, name: "Coach A", email: "coach.a@example.com", role: "coach" },
      { transaction },
    );
    await User.create(
      {
        organizationId: orgA.id,
        name: "Trainee A1",
        email: "trainee.a1@example.com",
        role: "trainee",
        coachId: coachA.id,
      },
      { transaction },
    );
    await User.create(
      {
        organizationId: orgA.id,
        name: "Trainee A2 (no coach)",
        email: "trainee.a2@example.com",
        role: "trainee",
      },
      { transaction },
    );

    // Org B: used to check that other orgs' data returns 404.
    const orgB = await Organization.create({ name: "Org B" }, { transaction });
    const coachB = await User.create(
      { organizationId: orgB.id, name: "Coach B", email: "coach.b@example.com", role: "coach" },
      { transaction },
    );
    await User.create(
      {
        organizationId: orgB.id,
        name: "Trainee B1",
        email: "trainee.b1@example.com",
        role: "trainee",
        coachId: coachB.id,
      },
      { transaction },
    );
  });

  const users = await User.findAll({ order: [["id", "ASC"]] });
  console.log(`Seeded ${EXERCISES.length} exercises and ${users.length} users:`);
  console.table(
    users.map((u) => ({ id: u.id, org: u.organizationId, role: u.role, coachId: u.coachId, name: u.name })),
  );
} finally {
  await sequelize.close();
}
