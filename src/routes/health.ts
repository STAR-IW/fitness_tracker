import { Router } from "express";
import { isDatabaseReachable } from "../services/health.service.js";

export const healthRouter = Router();

healthRouter.get("/health", async (_req, res) => {
  if (await isDatabaseReachable()) {
    res.status(200).json({ status: "ok" });
    return;
  }
  res.status(503).json({
    error: { code: "DB_UNAVAILABLE", message: "Database is unreachable" },
  });
});
