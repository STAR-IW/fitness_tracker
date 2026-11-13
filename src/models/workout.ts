import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { WORKOUT_FOCUS, type WorkoutFocus } from "./enums.js";

export class Workout extends Model<InferAttributes<Workout>, InferCreationAttributes<Workout>> {
  declare id: CreationOptional<number>;
  declare organizationId: number;
  declare traineeId: number;
  declare focus: WorkoutFocus;
  declare performedAt: Date;
  declare createdAt: CreationOptional<Date>;
}

Workout.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organizationId: { type: DataTypes.INTEGER, allowNull: false },
    traineeId: { type: DataTypes.INTEGER, allowNull: false },
    focus: { type: DataTypes.ENUM(...WORKOUT_FOCUS), allowNull: false },
    performedAt: { type: DataTypes.DATE, allowNull: false },
    createdAt: DataTypes.DATE,
  },
  { sequelize, tableName: "workouts" },
);
