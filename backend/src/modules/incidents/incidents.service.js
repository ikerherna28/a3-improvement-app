import {
  createIncident,
  findIncidentById,
  getIncidentStats,
  listIncidents,
  saveAiSummary,
  updateIncidentStatus
} from "../../repositories/incidentsRepository.js";
import { createNotFound } from "../../utils/httpError.js";
import { generateIncidentSummary } from "../../services/aiClient.js";

export async function createIncidentService(payload) {
  return createIncident(payload);
}

export async function listIncidentsService(filters) {
  return listIncidents(filters);
}

export async function getIncidentService(id) {
  const incident = await findIncidentById(id);
  if (!incident) {
    throw createNotFound("Incidente no encontrado");
  }
  return incident;
}

export async function updateIncidentStatusService(id, status) {
  const incident = await updateIncidentStatus(id, status);
  if (!incident) {
    throw createNotFound("Incidente no encontrado");
  }
  return incident;
}

export async function buildIncidentAiSummaryService(id) {
  const incident = await findIncidentById(id);
  if (!incident) {
    throw createNotFound("Incidente no encontrado");
  }

  const aiSummary = await generateIncidentSummary(incident);
  const updatedIncident = await saveAiSummary(id, aiSummary);
  return updatedIncident;
}

export async function getIncidentStatsService() {
  return getIncidentStats();
}
