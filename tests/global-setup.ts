// Runs once before all test files: ensures the test database exists and is migrated.
import pg from "pg";

export default async function setup() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  const dbName = url.pathname.slice(1);

  // Seeding wipes tables, so never touch anything that isn't clearly a test database.
  if (process.env.NODE_ENV !== "test" || !/^[a-z0-9_]+_test$/.test(dbName)) {
    throw new Error(
      `Refusing to run tests: need NODE_ENV=test and a DATABASE_URL whose DB name ends in _test (got "${dbName}").`,
    );
  }

  await createDatabaseIfMissing(url, dbName);

  // Imported after the guard so nothing connects before it passes.
  const { migrator } = await import("../src/db/umzug.js");
  const { sequelize } = await import("../src/db/sequelize.js");
  try {
    await migrator.up();
  } finally {
    await sequelize.close();
  }
}

async function createDatabaseIfMissing(url: URL, dbName: string) {
  const adminUrl = new URL(url);
  adminUrl.pathname = "/postgres";
  const client = new pg.Client({ connectionString: adminUrl.toString() });

  try {
    await client.connect();
  } catch (err) {
    throw new Error(
      `Cannot reach Postgres at ${url.host}. Is Docker running? Try: docker compose up -d\n${(err as Error).message}`,
    );
  }

  try {
    const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (!rowCount) {
      // dbName is validated above (lowercase letters, digits, underscores), so quoting it is safe.
      await client.query(`CREATE DATABASE "${dbName}"`);
    }
  } finally {
    await client.end();
  }
}