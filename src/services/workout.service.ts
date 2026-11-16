import type {WorkoutFocus} from "../models/enums.js";
import {Workout} from "../models/index.js";

export async function createWorkout(input: {
    traineeId: number;
    organizationId: number;
    focus: WorkoutFocus;
    performedAt: Date;
}) {

    return await Workout.create({
        traineeId:input.traineeId,
        organizationId:input.organizationId,
        focus:input.focus,
        performedAt:input.performedAt
    })

}