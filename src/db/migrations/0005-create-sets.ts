import { DataTypes, Op } from "sequelize";
import type { Migration } from "../umzug.js";

export const up: Migration = async ({ context: qi }) => {
  await qi.createTable("sets", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "workouts", key: "id" },
      onDelete: "CASCADE",
    },
    exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "exercises", key: "id" },
      onDelete: "RESTRICT",
    },
    set_number: { type: DataTypes.INTEGER, allowNull: false },
    reps: { type: DataTypes.INTEGER, allowNull: false },
    weight_kg: { type: DataTypes.DECIMAL(6, 2), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: qi.sequelize.fn("now") },
  });
  await qi.addConstraint("sets", {
    type: "unique",
    name: "sets_workout_exercise_set_number_unique",
    fields: ["workout_id", "exercise_id", "set_number"],
  });
  await qi.addConstraint("sets", {
    type: "check",
    name: "sets_reps_positive",
    fields: ["reps"],
    where: { reps: { [Op.gt]: 0 } },
  });
  await qi.addConstraint("sets", {
    type: "check",
    name: "sets_weight_kg_non_negative",
    fields: ["weight_kg"],
    where: { weight_kg: { [Op.gte]: 0 } },
  });
  await qi.addIndex("sets", ["workout_id"]);
  await qi.addIndex("sets", ["exercise_id"]);
};

export const down: Migration = async ({ context: qi }) => {
  await qi.dropTable("sets");
};
