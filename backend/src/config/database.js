import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { newDb } from "pg-mem";

import { env } from "./env.js";

const { Pool } = pg;

let pool = null;
let dbMode = "none";
let migrationsApplied = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, "..", "db", "migrations");

async function runMigrationsInternal() {
  if (migrationsApplied) {
    return;
  }

  const files = await fs.readdir(migrationsDir);
  const sqlFiles = files.filter((file) => file.endsWith(".sql")).sort();

  for (const file of sqlFiles) {
    const sqlPath = path.join(migrationsDir, file);
    const sql = await fs.readFile(sqlPath, "utf-8");
    await pool.query(sql);
  }

  migrationsApplied = true;
}

async function initializeMemoryPool() {
  const memDb = newDb();
  const memPg = memDb.adapters.createPg();
  const MemoryPool = memPg.Pool;

  pool = new MemoryPool();
  dbMode = "memory";

  if (env.autoMigrate) {
    await runMigrationsInternal();
  }
}

async function initializeRealPool() {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL no configurado. Revisa backend/.env");
  }

  pool = new Pool({
    connectionString: env.databaseUrl,
    connectionTimeoutMillis: env.dbConnectionTimeoutMs
  });

  await pool.query("SELECT 1");
  dbMode = "postgres";

  if (env.autoMigrate) {
    await runMigrationsInternal();
  }
}

async function ensurePool() {
  if (pool) {
    return;
  }

  try {
    await initializeRealPool();
  } catch (error) {
    const fallbackEnabled = env.dbFallbackToMemory;
    if (!fallbackEnabled) {
      throw error;
    }

    console.warn("PostgreSQL no disponible, activando base de datos en memoria");
    await initializeMemoryPool();
  }
}

export async function initializeDatabase() {
  await ensurePool();
  return { mode: dbMode };
}

export function getPool() {
  if (!pool) {
    throw new Error("Base de datos no inicializada. Ejecuta initializeDatabase primero.");
  }
  return pool;
}

export async function query(text, params = []) {
  await ensurePool();
  const dbPool = getPool();
  return dbPool.query(text, params);
}

export async function checkDbConnection() {
  await query("SELECT 1");
}

export function getDbMode() {
  return dbMode;
}
