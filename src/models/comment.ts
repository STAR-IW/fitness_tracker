import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const COMMENT_MAX_LENGTH = 1000;

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>;
  declare workoutId: number;
  declare authorId: number;
  declare body: string;
  declare createdAt: CreationOptional<Date>;
}

Comment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    workoutId: { type: DataTypes.INTEGER, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    body: { type: DataTypes.STRING(COMMENT_MAX_LENGTH), allowNull: false },
    createdAt: DataTypes.DATE,
  },
  { sequelize, tableName: "comments" },
);
