import {
  createIncidentService,
  getIncidentService,
  getIncidentStatsService,
  listIncidentsService,
  updateIncidentStatusService,
  buildIncidentAiSummaryService
} from "./incidents.service.js";
import { createIncidentSchema, updateIncidentStatusSchema } from "./incidents.schema.js";

export async function createIncidentController(req, res, next) {
  try {
    const payload = createIncidentSchema.parse(req.body);
    const incident = await createIncidentService(payload);
    res.status(201).json(incident);
  } catch (error) {
    next(error);
  }
}

export async function listIncidentsController(req, res, next) {
  try {
    const incidents = await listIncidentsService({
      status: req.query.status,
      area: req.query.area
    });
    res.json(incidents);
  } catch (error) {
    next(error);
  }
}

export async function getIncidentController(req, res, next) {
  try {
    const incident = await getIncidentService(Number(req.params.id));
    res.json(incident);
  } catch (error) {
    next(error);
  }
}

export async function updateIncidentStatusController(req, res, next) {
  try {
    const payload = updateIncidentStatusSchema.parse(req.body);
    const incident = await updateIncidentStatusService(Number(req.params.id), payload.status);
    res.json(incident);
  } catch (error) {
    next(error);
  }
}

export async function buildIncidentAiSummaryController(req, res, next) {
  try {
    const incident = await buildIncidentAiSummaryService(Number(req.params.id));
    res.json(incident);
  } catch (error) {
    next(error);
  }
}

export async function getIncidentStatsController(_req, res, next) {
  try {
    const stats = await getIncidentStatsService();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}
