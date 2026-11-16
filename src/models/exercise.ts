import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { MUSCLE_GROUP_VALUES, type MuscleGroup } from "./enums.js";

export class Exercise extends Model<InferAttributes<Exercise>, InferCreationAttributes<Exercise>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare muscleGroup: MuscleGroup;
  declare createdAt: CreationOptional<Date>;
}

Exercise.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    muscleGroup: { type: DataTypes.ENUM(...MUSCLE_GROUP_VALUES), allowNull: false },
    createdAt: DataTypes.DATE,
  },
  { sequelize, tableName: "exercises" },
);
