import type { Request, Response, NextFunction } from "express";
import { User } from "../models/index.js";

export async function auth(req: Request, res: Response, next: NextFunction) {
    const userId = Number(req.get("x-user-id"));
    if (!Number.isInteger(userId)) {
        return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing or invalid user" } });
    }

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing or invalid user" } });
    }

    req.user = {
        id: user.id,
        role: user.role,
        organizationId: user.organizationId,
        coachId: user.coachId,
    };
    next();
}