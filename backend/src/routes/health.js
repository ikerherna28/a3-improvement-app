import { Router } from "express";

import { env } from "../config/env.js";
import { checkDbConnection, getDbMode } from "../config/database.js";

const router = Router();

router.get("/health", async (_req, res) => {
  let dbStatus = "disabled";

  if (env.databaseUrl) {
    try {
      await checkDbConnection();
      dbStatus = "ok";
    } catch (_error) {
      dbStatus = "error";
    }
  }

  res.json({
    status: dbStatus === "error" ? "degraded" : "ok",
    service: "a3-improvement-backend",
    env: env.nodeEnv,
    db: dbStatus,
    dbMode: getDbMode() || "uninitialized"
  });
});

export default router;
