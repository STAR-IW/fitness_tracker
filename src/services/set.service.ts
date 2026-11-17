import { UniqueConstraintError } from "sequelize";
import { Exercise, Workout, WorkoutSet } from "../models/index.js";
type CreateSetResult =
    | { ok: true; set: WorkoutSet }
    | { ok: false; error: "WORKOUT_NOT_FOUND" | "EXERCISE_NOT_FOUND" | "DUPLICATE_SET" };

export async function createSet(input: {
    traineeId: number;
    organizationId: number;
    workoutId: number;
    exerciseId: number;
    setNumber: number;
    reps: number;
    weightKg: number;
}): Promise<CreateSetResult> {
    const workout = await Workout.findOne({
        where: { id: input.workoutId, traineeId: input.traineeId, organizationId: input.organizationId },
    });
    if (!workout) return { ok: false, error: "WORKOUT_NOT_FOUND" };

    const exercise = await Exercise.findByPk(input.exerciseId);
    if (!exercise) return { ok: false, error: "EXERCISE_NOT_FOUND" };

    try {
        const set = await WorkoutSet.create({
            workoutId: input.workoutId,
            exerciseId: input.exerciseId,
            setNumber: input.setNumber,
            reps: input.reps,
            weightKg: input.weightKg,
        });
        return { ok: true, set };
    } catch (err) {
        if (err instanceof UniqueConstraintError) return { ok: false, error: "DUPLICATE_SET" };
        throw err;
    }
}