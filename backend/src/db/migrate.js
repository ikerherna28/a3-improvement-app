import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getPool } from "./pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, "migrations");

export async function runMigrations() {
  const pool = getPool();
  const files = await fs.readdir(migrationsDir);
  const sqlFiles = files.filter((file) => file.endsWith(".sql")).sort();

  for (const file of sqlFiles) {
    const sqlPath = path.join(migrationsDir, file);
    const sql = await fs.readFile(sqlPath, "utf-8");
    await pool.query(sql);
  }
}
