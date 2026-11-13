import { Sequelize } from "sequelize";
import { config } from "../config.js";

export const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
    updatedAt: false,
  },
});
