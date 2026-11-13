import { Comment } from "./comment.js";
import { Exercise } from "./exercise.js";
import { Organization } from "./organization.js";
import { User } from "./user.js";
import { Workout } from "./workout.js";
import { WorkoutSet } from "./workout-set.js";

// Associations mirror the foreign keys in src/db/migrations. Schema changes go
// through migrations only; never call sequelize.sync().
Organization.hasMany(User, { foreignKey: "organizationId" });
User.belongsTo(Organization, { foreignKey: "organizationId" });

User.belongsTo(User, { as: "coach", foreignKey: "coachId" });
User.hasMany(User, { as: "trainees", foreignKey: "coachId" });

Organization.hasMany(Workout, { foreignKey: "organizationId" });
Workout.belongsTo(Organization, { foreignKey: "organizationId" });

User.hasMany(Workout, { as: "workouts", foreignKey: "traineeId" });
Workout.belongsTo(User, { as: "trainee", foreignKey: "traineeId" });

Workout.hasMany(WorkoutSet, { as: "sets", foreignKey: "workoutId" });
WorkoutSet.belongsTo(Workout, { foreignKey: "workoutId" });

Exercise.hasMany(WorkoutSet, { foreignKey: "exerciseId" });
WorkoutSet.belongsTo(Exercise, { foreignKey: "exerciseId" });

Workout.hasMany(Comment, { as: "comments", foreignKey: "workoutId" });
Comment.belongsTo(Workout, { foreignKey: "workoutId" });

User.hasMany(Comment, { as: "comments", foreignKey: "authorId" });
Comment.belongsTo(User, { as: "author", foreignKey: "authorId" });

export { Comment, Exercise, Organization, User, Workout, WorkoutSet };
