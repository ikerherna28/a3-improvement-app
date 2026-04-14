import { Router } from "express";

import healthRouter from "./health.js";
import authRouter from "./auth.js";
import { authenticateJWT } from "../middleware/auth.js";
import incidentsRouter from "../modules/incidents/incidents.routes.js";
import dataRouter from "./data.js";
import aiRouter from "./ai.js";
import a3Router from "./a3.js";

const router = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/incidents", authenticateJWT, incidentsRouter);
router.use("/data", authenticateJWT, dataRouter);
router.use("/ai", authenticateJWT, aiRouter);
router.use("/a3", authenticateJWT, a3Router);

export default router;
