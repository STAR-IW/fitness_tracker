import { DataTypes } from "sequelize";
import type { Migration } from "../umzug.js";

export const up: Migration = async ({ context: qi }) => {
  await qi.createTable("workouts", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "organizations", key: "id" },
      onDelete: "RESTRICT",
    },
    trainee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "RESTRICT",
    },
    focus: {
      type: DataTypes.ENUM("chest", "back", "legs", "shoulders", "arms", "fullbody"),
      allowNull: false,
    },
    // DataTypes.DATE is TIMESTAMP WITH TIME ZONE on Postgres.
    performed_at: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: qi.sequelize.fn("now") },
  });
  await qi.addIndex("workouts", ["trainee_id", "performed_at"]);
  await qi.addIndex("workouts", ["organization_id"]);
};

export const down: Migration = async ({ context: qi }) => {
  await qi.dropTable("workouts");
  await qi.sequelize.query('DROP TYPE IF EXISTS "enum_workouts_focus"');
};
