import { config } from "./config.js";
import { createApp } from "./app.js";
import { sequelize } from "./db/sequelize.js";
import "./models/index.js";

try {
  await sequelize.authenticate();
  console.log("Database connected");
} catch (err) {
  // Keep serving so GET /health can report 503 instead of the process dying.
  console.warn("Database not reachable at startup:", (err as Error).message);
}

const server = createApp().listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
});

function shutdown() {
  server.close(() => {
    void sequelize.close().finally(() => process.exit(0));
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
