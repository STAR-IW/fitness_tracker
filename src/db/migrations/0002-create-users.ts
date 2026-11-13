import { DataTypes } from "sequelize";
import type { Migration } from "../umzug.js";

export const up: Migration = async ({ context: qi }) => {
  await qi.createTable("users", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "organizations", key: "id" },
      onDelete: "RESTRICT",
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: { type: DataTypes.ENUM("coach", "trainee"), allowNull: false },
    coach_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
    },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: qi.sequelize.fn("now") },
  });
  await qi.addIndex("users", ["coach_id"]);
  await qi.addIndex("users", ["organization_id"]);
};

export const down: Migration = async ({ context: qi }) => {
  await qi.dropTable("users");
  await qi.sequelize.query('DROP TYPE IF EXISTS "enum_users_role"');
};
