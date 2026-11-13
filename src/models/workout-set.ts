import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/sequelize.js";

// Named WorkoutSet to avoid clashing with the built-in JS Set. Table: "sets".
export class WorkoutSet extends Model<
  InferAttributes<WorkoutSet>,
  InferCreationAttributes<WorkoutSet>
> {
  declare id: CreationOptional<number>;
  declare workoutId: number;
  declare exerciseId: number;
  declare setNumber: number;
  declare reps: number;
  declare weightKg: number;
  declare createdAt: CreationOptional<Date>;
}

WorkoutSet.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    workoutId: { type: DataTypes.INTEGER, allowNull: false },
    exerciseId: { type: DataTypes.INTEGER, allowNull: false },
    setNumber: { type: DataTypes.INTEGER, allowNull: false },
    reps: { type: DataTypes.INTEGER, allowNull: false },
    weightKg: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      // Postgres returns DECIMAL as a string; expose it as a number.
      get() {
        const raw = this.getDataValue("weightKg") as unknown;
        return raw == null ? raw : Number(raw);
      },
    },
    createdAt: DataTypes.DATE,
  },
  { sequelize, tableName: "sets" },
);
