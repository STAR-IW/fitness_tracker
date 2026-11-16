import { Router } from "express";
import { z } from "zod";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/require-role.js";
import { WORKOUT_FOCUS } from "../models/enums.js";
import { createWorkout } from "../services/workout.service.js";

export const workoutsRouter = Router();

const CreateWorkoutSchema = z.object({
    focus: z.enum(WORKOUT_FOCUS),
    performedAt: z.coerce.date(),
});

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