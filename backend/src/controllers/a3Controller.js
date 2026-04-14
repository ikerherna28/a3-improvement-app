import { z } from "zod";

import { query } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { generateA3PdfBuffer } from "../utils/pdfGenerator.js";

const a3StatusValues = ["ABIERTO", "EN_CURSO", "PENDIENTE", "CERRADO"];
const a3PriorityValues = ["BAJA", "MEDIA", "ALTA", "CRITICA"];

const createA3Schema = z.object({
  codigo: z.string().trim().min(3).max(50).optional(),
  titulo: z.string().trim().min(3).max(200),
  descripcionProblema: z.string().trim().min(10),
  causaRaiz: z.string().trim().optional(),
  accionCorrectiva: z.string().trim().optional(),
  estado: z.enum(a3StatusValues).optional(),
  prioridad: z.enum(a3PriorityValues).optional(),
  area: z.string().trim().min(2).max(120),
  rawDataId: z.number().int().positive().optional(),
  rawDataIds: z.array(z.number().int().positive()).max(200).optional(),
  paretoData: z.record(z.any()).optional()
});

const updateA3Schema = z
  .object({
    titulo: z.string().trim().min(3).max(200).optional(),
    descripcionProblema: z.string().trim().min(10).optional(),
    causaRaiz: z.string().trim().optional(),
    accionCorrectiva: z.string().trim().optional(),
    estado: z.enum(a3StatusValues).optional(),
    prioridad: z.enum(a3PriorityValues).optional(),
    area: z.string().trim().min(2).max(120).optional(),
    rawDataId: z.number().int().positive().nullable().optional(),
    rawDataIds: z.array(z.number().int().positive()).max(200).optional(),
    paretoData: z.record(z.any()).optional()
  })
  .refine((value) => Object.keys(value).length > 0, "Debes enviar al menos un campo para actualizar");

const updateStatusSchema = z.object({
  estado: z.enum(a3StatusValues)
});

const listA3QuerySchema = z.object({
  estado: z.enum(a3StatusValues).optional(),
  area: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

function generateCode() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `A3-${y}${m}${d}-${hh}${mm}-${random}`;
}

function mapA3Row(row) {
  return {
    id: row.id,
    codigo: row.codigo,
    titulo: row.titulo,
    descripcionProblema: row.descripcion_problema,
    causaRaiz: row.causa_raiz,
    accionCorrectiva: row.accion_correctiva,
    estado: row.estado,
    prioridad: row.prioridad,
    area: row.area,
    createdBy: row.created_by,
    rawDataId: row.raw_data_id,
    paretoData: row.pareto_data,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    closedAt: row.closed_at
  };
}

async function validateRawDataIds(rawDataIds) {
  if (!rawDataIds?.length) {
    return;
  }

  const uniqueIds = [...new Set(rawDataIds)];
  const placeholders = uniqueIds.map((_, index) => `$${index + 1}`).join(", ");
  const result = await query(`SELECT id FROM raw_data WHERE id IN (${placeholders})`, uniqueIds);

  if (result.rowCount !== uniqueIds.length) {
    throw new HttpError(400, "Uno o mas rawDataIds no existen en raw_data");
  }
}

async function syncA3RawDataLinks(a3Id, rawDataIds) {
  await query("DELETE FROM a3_raw_data_rel WHERE a3_id = $1", [a3Id]);

  if (!rawDataIds?.length) {
    return;
  }

  const uniqueIds = [...new Set(rawDataIds)];
  for (const rawDataId of uniqueIds) {
    await query(
      `
        INSERT INTO a3_raw_data_rel (a3_id, raw_data_id)
        VALUES ($1, $2)
        ON CONFLICT (a3_id, raw_data_id) DO NOTHING
      `,
      [a3Id, rawDataId]
    );
  }
}

async function getA3ByIdOrFail(id) {
  const a3Result = await query("SELECT * FROM a3_registros WHERE id = $1", [id]);
  if (!a3Result.rowCount) {
    throw new HttpError(404, "A3 no encontrado");
  }

  const linksResult = await query(
    "SELECT raw_data_id FROM a3_raw_data_rel WHERE a3_id = $1 ORDER BY raw_data_id",
    [id]
  );

  const a3 = mapA3Row(a3Result.rows[0]);
  a3.rawDataIds = linksResult.rows.map((row) => row.raw_data_id);
  return a3;
}

export async function createA3(req, res, next) {
  try {
    const payload = createA3Schema.parse(req.body || {});

    const primaryRawId = payload.rawDataId || null;
    const linkedRawIds = payload.rawDataIds || (primaryRawId ? [primaryRawId] : []);

    await validateRawDataIds(linkedRawIds);

    const result = await query(
      `
        INSERT INTO a3_registros (
          codigo,
          titulo,
          descripcion_problema,
          causa_raiz,
          accion_correctiva,
          estado,
          prioridad,
          area,
          created_by,
          raw_data_id,
          pareto_data,
          updated_at,
          closed_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),$12)
        RETURNING *
      `,
      [
        payload.codigo || generateCode(),
        payload.titulo,
        payload.descripcionProblema,
        payload.causaRaiz || null,
        payload.accionCorrectiva || null,
        payload.estado || "ABIERTO",
        payload.prioridad || "MEDIA",
        payload.area,
        req.user?.id ? Number(req.user.id) : null,
        primaryRawId,
        payload.paretoData ? JSON.stringify(payload.paretoData) : null,
        (payload.estado || "ABIERTO") === "CERRADO" ? new Date().toISOString() : null
      ]
    );

    const a3 = mapA3Row(result.rows[0]);
    await syncA3RawDataLinks(a3.id, linkedRawIds);
    const fullA3 = await getA3ByIdOrFail(a3.id);

    return res.status(201).json(fullA3);
  } catch (error) {
    return next(error);
  }
}

export async function getA3(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, "ID de A3 invalido");
    }

    const a3 = await getA3ByIdOrFail(id);
    return res.json(a3);
  } catch (error) {
    return next(error);
  }
}

export async function listA3(req, res, next) {
  try {
    const filters = listA3QuerySchema.parse(req.query || {});
    const offset = (filters.page - 1) * filters.limit;

    const where = [];
    const params = [];

    if (filters.estado) {
      params.push(filters.estado);
      where.push(`estado = $${params.length}`);
    }

    if (filters.area) {
      params.push(filters.area);
      where.push(`area = $${params.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    params.push(filters.limit);
    const limitParam = `$${params.length}`;
    params.push(offset);
    const offsetParam = `$${params.length}`;

    const rowsResult = await query(
      `
        SELECT *
        FROM a3_registros
        ${whereSql}
        ORDER BY updated_at DESC
        LIMIT ${limitParam} OFFSET ${offsetParam}
      `,
      params
    );

    const countResult = await query(
      `SELECT COUNT(*)::int AS total FROM a3_registros ${whereSql}`,
      params.slice(0, params.length - 2)
    );

    return res.json({
      page: filters.page,
      limit: filters.limit,
      total: countResult.rows[0]?.total || 0,
      items: rowsResult.rows.map(mapA3Row)
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateA3(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, "ID de A3 invalido");
    }

    const payload = updateA3Schema.parse(req.body || {});

    if (payload.rawDataIds) {
      await validateRawDataIds(payload.rawDataIds);
    }

    if (payload.rawDataId !== undefined && payload.rawDataId !== null) {
      await validateRawDataIds([payload.rawDataId]);
    }

    const fields = [];
    const values = [];

    const addField = (column, value) => {
      values.push(value);
      fields.push(`${column} = $${values.length}`);
    };

    if (payload.titulo !== undefined) addField("titulo", payload.titulo);
    if (payload.descripcionProblema !== undefined) addField("descripcion_problema", payload.descripcionProblema);
    if (payload.causaRaiz !== undefined) addField("causa_raiz", payload.causaRaiz || null);
    if (payload.accionCorrectiva !== undefined) addField("accion_correctiva", payload.accionCorrectiva || null);
    if (payload.estado !== undefined) addField("estado", payload.estado);
    if (payload.prioridad !== undefined) addField("prioridad", payload.prioridad);
    if (payload.area !== undefined) addField("area", payload.area);
    if (payload.rawDataId !== undefined) addField("raw_data_id", payload.rawDataId);
    if (payload.paretoData !== undefined) addField("pareto_data", JSON.stringify(payload.paretoData));

    if (payload.estado !== undefined) {
      addField("closed_at", payload.estado === "CERRADO" ? new Date().toISOString() : null);
    }

    fields.push("updated_at = NOW()");

    values.push(id);

    const result = await query(
      `
        UPDATE a3_registros
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING *
      `,
      values
    );

    if (!result.rowCount) {
      throw new HttpError(404, "A3 no encontrado");
    }

    if (payload.rawDataIds) {
      await syncA3RawDataLinks(id, payload.rawDataIds);
    }

    const fullA3 = await getA3ByIdOrFail(id);
    return res.json(fullA3);
  } catch (error) {
    return next(error);
  }
}

export async function changeA3Status(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, "ID de A3 invalido");
    }

    const payload = updateStatusSchema.parse(req.body || {});

    const result = await query(
      `
        UPDATE a3_registros
        SET
          estado = $2,
          closed_at = CASE WHEN $2 = 'CERRADO' THEN NOW() ELSE NULL END,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [id, payload.estado]
    );

    if (!result.rowCount) {
      throw new HttpError(404, "A3 no encontrado");
    }

    const fullA3 = await getA3ByIdOrFail(id);
    return res.json(fullA3);
  } catch (error) {
    return next(error);
  }
}

export async function downloadA3Pdf(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, "ID de A3 invalido");
    }

    const a3 = await getA3ByIdOrFail(id);
    const pdfBuffer = await generateA3PdfBuffer(a3);

    const safeCode = (a3.codigo || `A3-${id}`).replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileName = `${safeCode}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    return next(error);
  }
}
