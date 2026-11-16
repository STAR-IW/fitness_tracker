import { sequelize } from "./sequelize.js";
import { Exercise, Organization, User } from "../models/index.js";

export const EXERCISES = [
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

/**
 * Wipes all app tables and inserts the demo data. Ids are stable (RESTART IDENTITY):
 * users 1 Coach A, 2 Trainee A1 (coach 1), 3 Trainee A2 (no coach) in org 1;
 * 4 Coach B, 5 Trainee B1 (coach 4) in org 2.
 * Callers are responsible for not running this against production.
 */
export async function seedDatabase(): Promise<void> {
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
}