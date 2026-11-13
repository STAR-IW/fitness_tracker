import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SequelizeStorage, Umzug } from "umzug";
import { sequelize } from "./sequelize.js";

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");

export const migrator = new Umzug({
  migrations: {
    // .ts under tsx in dev, .js after `npm run build`.
    glob: ["*.{ts,js}", { cwd: migrationsDir, ignore: ["*.d.ts"] }],
    resolve: ({ name, path: filePath, context }) => {
      // Strip the extension so dev (.ts) and build (.js) record the same name.
      const migrationName = name.replace(/\.(ts|js)$/, "");
      const load = () => import(pathToFileURL(filePath!).href);
      return {
        name: migrationName,
        up: async () => (await load()).up({ context }),
        down: async () => (await load()).down({ context }),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
