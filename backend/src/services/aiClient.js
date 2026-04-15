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
    const fallbackMessage = [
      "Modo local sin API key de Google AI.",
      "", 
      "Resumen profesional generado por el sistema:",
      "- El entorno no tiene GOOGLE_AI_API_KEY configurada, por lo que se devuelve una respuesta segura y determinista.",
      "- La estructura del prompt fue recibida correctamente y puede activarse Gemini cuando la clave esté disponible.",
      "- Recomendación: configurar la API key para obtener análisis generados por Gemini en producción."
    ].join("\n");

    return fallbackMessage;
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
