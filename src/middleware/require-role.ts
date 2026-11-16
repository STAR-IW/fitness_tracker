import type { Request, Response, NextFunction } from "express";
import type { Role } from "../models/enums.js";

export function requireRole(...roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: { code: "FORBIDDEN", message: "Role not allowed" } });
        }
        next();
    };
}