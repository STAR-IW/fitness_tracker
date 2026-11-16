// Enum-like objects: use ROLES.trainee in code, *_VALUES for DataTypes.ENUM(...) and z.enum(...).
// Migrations keep their own hard-coded copies of these values; don't import this file there.

export const ROLES = {
  coach: "coach",
  trainee: "trainee",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];
export const ROLE_VALUES = Object.values(ROLES) as [Role, ...Role[]];

export const WORKOUT_FOCUS = {
  chest: "chest",
  back: "back",
  legs: "legs",
  shoulders: "shoulders",
  arms: "arms",
  fullbody: "fullbody",
} as const;
export type WorkoutFocus = (typeof WORKOUT_FOCUS)[keyof typeof WORKOUT_FOCUS];
export const WORKOUT_FOCUS_VALUES = Object.values(WORKOUT_FOCUS) as [WorkoutFocus, ...WorkoutFocus[]];

export const MUSCLE_GROUPS = {
  chest: "chest",
  back: "back",
  legs: "legs",
  shoulders: "shoulders",
  arms: "arms",
  core: "core",
} as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[keyof typeof MUSCLE_GROUPS];
export const MUSCLE_GROUP_VALUES = Object.values(MUSCLE_GROUPS) as [MuscleGroup, ...MuscleGroup[]];
