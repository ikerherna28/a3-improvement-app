import { z } from "zod";

import { query } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { generateWithGemini } from "../services/aiClient.js";

const filterSchema = z.object({
  area: z.string().trim().optional(),
  sourceType: z.string().trim().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  top: z.coerce.number().int().min(1).max(30).default(10),
  contexto: z.string().trim().max(4000).optional()
});

function buildWhere(filters) {
  const where = [];
  const params = [];

  if (filters.area) {
    params.push(filters.area);
    where.push(`payload->>'area' = $${params.length}`);
  }

  if (filters.sourceType) {
    params.push(filters.sourceType);
    where.push(`source_type = $${params.length}`);
  }

  if (filters.dateFrom) {
    params.push(filters.dateFrom);
    where.push(`uploaded_at >= $${params.length}`);
  }

  if (filters.dateTo) {
    params.push(filters.dateTo);
    where.push(`uploaded_at <= $${params.length}`);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
    params
  };
}

async function getParetoData(filters) {
  try {
    const { whereSql, params } = buildWhere(filters);

    const limitParams = [...params, filters.top];
    const paretoResult = await query(
      `
        SELECT COALESCE(payload->>'causa', 'Sin causa') AS causa,
               COUNT(*)::int AS total
        FROM raw_data
        ${whereSql}
        GROUP BY COALESCE(payload->>'causa', 'Sin causa')
        ORDER BY total DESC
        LIMIT $${limitParams.length}
      `,
      limitParams
    );

    const totalResult = await query(
      `
        SELECT COUNT(*)::int AS total
        FROM raw_data
        ${whereSql}
      `,
      params
    );

    return {
      total: totalResult.rows[0]?.total || 0,
      causas: paretoResult.rows
    };
  } catch (_error) {
    throw new HttpError(503, "Base de datos no disponible para analisis IA");
  }
}

function ensureDataAvailability(pareto) {
  if (!pareto.total) {
    throw new HttpError(400, "No hay datos para generar analisis. Sube datos primero en /api/data/upload");
  }
}

function buildBaseContext(filters, pareto) {
  return {
    filtros: {
      area: filters.area || "todas",
      sourceType: filters.sourceType || "todos",
      dateFrom: filters.dateFrom || "sin limite",
      dateTo: filters.dateTo || "sin limite"
    },
    totalRegistros: pareto.total,
    topCausas: pareto.causas
  };
}

export async function generateAnalisis(req, res, next) {
  try {
    const filters = filterSchema.parse(req.body || {});
    const pareto = await getParetoData(filters);
    ensureDataAvailability(pareto);

    const prompt = `
Eres consultor senior de mejora continua A3 en entorno industrial.
Genera un analisis ejecutivo en espanol, profesional y accionable.

Contexto de datos: ${JSON.stringify(buildBaseContext(filters, pareto), null, 2)}
Contexto adicional del usuario: ${filters.contexto || "No proporcionado"}

Requisitos de salida:
1) Resumen ejecutivo (maximo 120 palabras).
2) Hallazgos clave del Pareto.
3) Riesgos operativos si no se actua.
4) 5 recomendaciones priorizadas (alto impacto / baja complejidad primero).
5) KPI sugeridos para seguimiento semanal.
    `;

    const texto = await generateWithGemini(prompt);
    return res.json({ tipo: "analisis", texto, basePareto: pareto });
  } catch (error) {
    return next(error);
  }
}

export async function generateCausaRaiz(req, res, next) {
  try {
    const filters = filterSchema.parse(req.body || {});
    const pareto = await getParetoData(filters);
    ensureDataAvailability(pareto);

    const topCause = pareto.causas[0]?.causa || "Sin causa identificada";
    const prompt = `
Actua como especialista Lean y Six Sigma.
Realiza un analisis 5-Why en espanol sobre la causa principal detectada.

Causa principal: ${topCause}
Datos de soporte: ${JSON.stringify(buildBaseContext(filters, pareto), null, 2)}
Contexto adicional: ${filters.contexto || "No proporcionado"}

Formato obligatorio:
- Problema observado
- Why 1
- Why 2
- Why 3
- Why 4
- Why 5
- Causa raiz validable
- Evidencias requeridas para confirmar la causa
    `;

    const texto = await generateWithGemini(prompt);
    return res.json({ tipo: "causa_raiz", texto, causaPrincipal: topCause });
  } catch (error) {
    return next(error);
  }
}

export async function generatePlanAccion(req, res, next) {
  try {
    const filters = filterSchema.parse(req.body || {});
    const pareto = await getParetoData(filters);
    ensureDataAvailability(pareto);

    const prompt = `
Eres un lider de mejora continua A3.
Genera un plan de accion concreto en espanol para reducir las principales causas del Pareto.

Datos Pareto: ${JSON.stringify(buildBaseContext(filters, pareto), null, 2)}
Contexto adicional: ${filters.contexto || "No proporcionado"}

El plan debe incluir tabla textual con columnas:
- accion
- responsable sugerido
- plazo recomendado
- impacto esperado
- indicador de exito
- riesgo de implementacion

Cierra con una secuencia de implementacion en 30-60-90 dias.
    `;

    const texto = await generateWithGemini(prompt);
    return res.json({ tipo: "plan_accion", texto });
  } catch (error) {
    return next(error);
  }
}

export async function generateEstandarizacion(req, res, next) {
  try {
    const filters = filterSchema.parse(req.body || {});
    const pareto = await getParetoData(filters);
    ensureDataAvailability(pareto);

    const prompt = `
Actua como responsable de estandarizacion operativa.
Genera una propuesta de estandarizacion para sostener mejoras A3.

Datos Pareto: ${JSON.stringify(buildBaseContext(filters, pareto), null, 2)}
Contexto adicional: ${filters.contexto || "No proporcionado"}

Incluye:
1) Estandar de trabajo propuesto.
2) Checklist de auditoria de cumplimiento.
3) Matriz de capacitacion por rol.
4) Frecuencia de revision y gobernanza.
5) Plan de reaccion ante desviaciones.

Todo en espanol, orientado a planta, claro y profesional.
    `;

    const texto = await generateWithGemini(prompt);
    return res.json({ tipo: "estandarizacion", texto });
  } catch (error) {
    return next(error);
  }
}
