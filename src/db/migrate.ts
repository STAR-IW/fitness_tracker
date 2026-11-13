// Usage: npm run db:migrate | db:migrate:undo | db:migrate:status
// Extra Umzug CLI args pass through, e.g. `npm run db:migrate:undo -- --to 0`.
import { migrator } from "./umzug.js";
import { sequelize } from "./sequelize.js";

try {
  await migrator.runAsCLI();
} finally {
  await sequelize.close();
}
