import { DataTypes } from "sequelize";
import type { Migration } from "../umzug.js";

export const up: Migration = async ({ context: qi }) => {
  await qi.createTable("exercises", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    muscle_group: {
      type: DataTypes.ENUM("chest", "back", "legs", "shoulders", "arms", "core"),
      allowNull: false,
    },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: qi.sequelize.fn("now") },
  });
};

export const down: Migration = async ({ context: qi }) => {
  await qi.dropTable("exercises");
  await qi.sequelize.query('DROP TYPE IF EXISTS "enum_exercises_muscle_group"');
};
