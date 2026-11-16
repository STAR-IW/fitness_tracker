// Last-resort handler: errors become JSON in the standard error shape.
import type {ErrorRequestHandler} from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    // Client errors raised by Express itself (e.g. malformed JSON body → 400).
    const status = typeof err?.status === "number" ? err.status : 500;
    if (status >= 400 && status < 500) {
        res.status(status).json({ error: { code: "BAD_REQUEST", message: "Invalid request" } });
        return;
    }
    console.error(err);
    res.status(500).json({ error: { code: "INTERNAL", message: "Internal server error" } });
};