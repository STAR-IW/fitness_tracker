import express, { type ErrorRequestHandler } from "express";
import { healthRouter } from "./routes/health.js";
import {errorHandler} from "./middleware/error-handler.js";



export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(healthRouter);
  app.use(errorHandler);
  return app;
}
