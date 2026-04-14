import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

export function createAiModel() {
  if (!env.googleAiApiKey) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(env.googleAiApiKey);
  return genAI.getGenerativeModel({ model: env.googleAiModel });
}

export async function generateWithGemini(prompt) {
  const model = createAiModel();

  if (!model) {
    throw new HttpError(503, "Google AI no configurado. Define GOOGLE_AI_API_KEY en backend/.env");
  }

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new HttpError(502, `Fallo al generar respuesta con Google AI: ${error.message}`);
  }
}

export async function generateIncidentSummary(incident) {
  const prompt = `
Eres un especialista en mejora continua A3.
Resume el incidente en espanol y devuelve:
1) impacto operativo,
2) hipotesis de causa raiz,
3) recomendacion accionable en 3 pasos.

Datos del incidente:
- Titulo: ${incident.title}
- Area: ${incident.area}
- Problema: ${incident.problemDescription}
- Causa raiz reportada: ${incident.rootCause || "No indicada"}
- Accion correctiva propuesta: ${incident.correctiveAction || "No indicada"}
- Estado: ${incident.status}
- Prioridad: ${incident.priority}
  `;

  return generateWithGemini(prompt);
}
