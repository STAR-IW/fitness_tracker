export const ROLES = ["coach", "trainee"] as const;
export type Role = (typeof ROLES)[number];

export const WORKOUT_FOCUS = ["chest", "back", "legs", "shoulders", "arms", "fullbody"] as const;
export type WorkoutFocus = (typeof WORKOUT_FOCUS)[number];

export const MUSCLE_GROUPS = ["chest", "back", "legs", "shoulders", "arms", "core"] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
