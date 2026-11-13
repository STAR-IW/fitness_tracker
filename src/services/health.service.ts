import { sequelize } from "../db/sequelize.js";

const DB_CHECK_TIMEOUT_MS = 2000;

export async function isDatabaseReachable(): Promise<boolean> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("DB check timed out")), DB_CHECK_TIMEOUT_MS);
  });

  try {
    await Promise.race([sequelize.query("SELECT 1"), timeout]);
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
