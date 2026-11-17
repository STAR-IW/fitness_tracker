import { Router } from "express";
import { z } from "zod";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/require-role.js";
import { WORKOUT_FOCUS } from "../models/enums.js";
import { createWorkout } from "../services/workout.service.js";
import {createSet} from "../services/set.service.js";

export const workoutsRouter = Router();

const CreateWorkoutSchema = z.object({
    focus: z.enum(WORKOUT_FOCUS),
    performedAt: z.coerce.date(),
});
const CreateSetSchema = z.object({
    exerciseId: z.number().int().positive(),
    setNumber: z.number().int().positive(),
    reps: z.number().int().positive(),
    weightKg: z.number().nonnegative(),
});
const WorkoutParamsSchema = z.object({
    workoutId: z.coerce.number().int().positive(),
})
workoutsRouter.post("/workouts", auth, requireRole("trainee"), async (req, res) => {
    const parsed = CreateWorkoutSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input" } });
    }

    const user = req.user!;
    const workout = await createWorkout({
        traineeId: user.id,
        organizationId: user.organizationId,
        focus: parsed.data.focus,
        performedAt: parsed.data.performedAt,
    });

    return res.status(201).json(workout);
});

workoutsRouter.post("/workouts/:workoutId/sets", auth, requireRole("trainee"), async (req, res) => {

    const params = WorkoutParamsSchema.safeParse(req.params);
    if (!params.success) {
        return res.status(404).json({ error: { code: "NOT_FOUND", message: "Workout not found" } });
    }
    const parsed = CreateSetSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid input" } });
    }

    const user = req.user!;
    const result = await createSet({
        traineeId:user.id,
        organizationId:user.organizationId,
        workoutId:Number(params.data.workoutId),
        exerciseId:parsed.data.exerciseId,
        setNumber:parsed.data.setNumber,
        reps:parsed.data.reps,
        weightKg:parsed.data.weightKg,
    });
    if (!result.ok) {
        switch (result.error) {
            case "WORKOUT_NOT_FOUND":
                return res.status(404).json({ error: { code: "NOT_FOUND", message: "Workout not found" } });
            case "EXERCISE_NOT_FOUND":
                return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Unknown exercise" } });
            case "DUPLICATE_SET":
                return res.status(409).json({ error: { code: "CONFLICT", message: "Set already exists" } });
        }
    }
    return res.status(201).json(result.set);
})