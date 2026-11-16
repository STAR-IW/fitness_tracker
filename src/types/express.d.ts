import type { Role } from "../models/enums.js";

// The authenticated user, set by src/middleware/auth.ts.
export interface AuthUser {
  id: number;
  role: Role;
  organizationId: number;
  coachId: number | null;
}

declare global {
  namespace Express {
    interface Request {
      // Only present after the `auth` middleware has run.
      user?: AuthUser;
    }
  }
}