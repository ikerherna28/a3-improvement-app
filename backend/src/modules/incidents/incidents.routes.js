import { Router } from "express";

import {
  buildIncidentAiSummaryController,
  createIncidentController,
  getIncidentController,
  getIncidentStatsController,
  listIncidentsController,
  updateIncidentStatusController
} from "./incidents.controller.js";

const router = Router();

router.get("/", listIncidentsController);
router.get("/stats", getIncidentStatsController);
router.get("/:id", getIncidentController);
router.post("/", createIncidentController);
router.patch("/:id/status", updateIncidentStatusController);
router.post("/:id/ai-summary", buildIncidentAiSummaryController);

export default router;
