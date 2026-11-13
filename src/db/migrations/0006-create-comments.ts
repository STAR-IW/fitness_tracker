import { DataTypes } from "sequelize";
import type { Migration } from "../umzug.js";

export const up: Migration = async ({ context: qi }) => {
  await qi.createTable("comments", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "workouts", key: "id" },
      onDelete: "CASCADE",
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "RESTRICT",
    },
    body: { type: DataTypes.STRING(1000), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: qi.sequelize.fn("now") },
  });
  await qi.addIndex("comments", ["workout_id"]);
  await qi.addIndex("comments", ["author_id"]);
};

export const down: Migration = async ({ context: qi }) => {
  await qi.dropTable("comments");
};
