import crypto from "node:crypto";

import XLSX from "xlsx";
import { z } from "zod";

import { query } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sourceType: z.string().trim().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional()
});

const paretoQuerySchema = z.object({
  area: z.string().trim().optional(),
  sourceType: z.string().trim().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  top: z.coerce.number().int().min(1).max(50).default(10)
});

const normalizedRowSchema = z.object({
  area: z.string().trim().min(1),
  problema: z.string().trim().min(3),
  causa: z.string().trim().default("Sin causa"),
  prioridad: z.string().trim().default("media"),
  estado: z.string().trim().default("abierto"),
  fecha: z.string().trim().optional().nullable(),
  responsable: z.string().trim().optional().nullable()
});

const areaKeys = ["area", "linea", "linea_area", "departamento", "sector"];
const problemaKeys = ["problema", "problem", "descripcion", "description", "detalle"];
const causaKeys = ["causa", "causa_raiz", "root_cause", "motivo"];
const prioridadKeys = ["prioridad", "priority"];
const estadoKeys = ["estado", "status"];
const fechaKeys = ["fecha", "date", "created_at"];
const responsableKeys = ["responsable", "owner", "encargado"];

function getCellValueByAliases(rawRow, aliases) {
  const entries = Object.entries(rawRow || {});
  for (const [key, value] of entries) {
    const normalizedKey = key.toString().trim().toLowerCase().replace(/\s+/g, "_");
    if (aliases.includes(normalizedKey)) {
      return value;
    }
  }
  return undefined;
}

function toTrimmedText(value) {
  if (value === undefined || value === null) {
    return "";
  }
  return String(value).trim();
}

function toOptionalTrimmedText(value) {
  const text = toTrimmedText(value);
  return text || null;
}

function normalizeRow(rawRow) {
  const normalized = {
    area: toTrimmedText(getCellValueByAliases(rawRow, areaKeys)) || "Sin area",
    problema: toTrimmedText(getCellValueByAliases(rawRow, problemaKeys)),
    causa: toTrimmedText(getCellValueByAliases(rawRow, causaKeys)) || "Sin causa",
    prioridad: toTrimmedText(getCellValueByAliases(rawRow, prioridadKeys)) || "media",
    estado: toTrimmedText(getCellValueByAliases(rawRow, estadoKeys)) || "abierto",
    fecha: toTrimmedText(getCellValueByAliases(rawRow, fechaKeys)) || null,
    responsable: toTrimmedText(getCellValueByAliases(rawRow, responsableKeys)) || null
  };

  return normalizedRowSchema.parse(normalized);
}

function parseWorkbookBuffer(file) {
  const workbook = XLSX.read(file.buffer, { type: "buffer", cellDates: false });
  const allRows = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    for (const row of rows) {
      allRows.push({ sheetName, row });
    }
  }

  return allRows;
}

function buildHash(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

function toIsoDateOrNull(rawValue) {
  if (!rawValue) {
    return null;
  }

  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export async function uploadData(req, res, next) {
  try {
    if (!req.file) {
      throw new HttpError(400, "Archivo requerido en campo 'file'.");
    }

    const sourceName = req.file.originalname;
    const sourceType = sourceName.toLowerCase().endsWith(".csv") ? "csv" : "excel";
    const parsedRows = parseWorkbookBuffer(req.file);
    const linea = toOptionalTrimmedText(req.body?.linea);
    const departamento = toOptionalTrimmedText(req.body?.departamento);

    if (!parsedRows.length) {
      throw new HttpError(400, "El archivo no contiene filas de datos.");
    }

    let inserted = 0;
    let duplicates = 0;
    let invalid = 0;

    for (const item of parsedRows) {
      try {
        const normalized = normalizeRow(item.row);
        const finalArea = normalized.area === "Sin area" ? (linea || departamento || normalized.area) : normalized.area;
        const normalizedWithMeta = {
          ...normalized,
          area: finalArea,
          linea_importada: linea,
          departamento_importado: departamento
        };
        const contentHash = buildHash(normalizedWithMeta);
        const uploadedBy = req.user?.id ? Number(req.user.id) : null;

        const insertResult = await query(
          `
            INSERT INTO raw_data (
              source_name,
              source_type,
              payload,
              uploaded_by,
              content_hash,
              original_filename,
              record_key
            )
            VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7)
            ON CONFLICT (content_hash) DO NOTHING
            RETURNING id
          `,
          [
            sourceName,
            sourceType,
            JSON.stringify({
              ...normalizedWithMeta,
              origen_hoja: item.sheetName,
              fecha_normalizada: toIsoDateOrNull(normalizedWithMeta.fecha)
            }),
            uploadedBy,
            contentHash,
            sourceName,
            `${normalizedWithMeta.area}|${normalizedWithMeta.problema}`.slice(0, 120)
          ]
        );

        if (insertResult.rowCount > 0) {
          inserted += 1;
        } else {
          duplicates += 1;
        }
      } catch (_error) {
        invalid += 1;
      }
    }

    return res.status(201).json({
      file: sourceName,
      totalRows: parsedRows.length,
      inserted,
      duplicates,
      invalid
    });
  } catch (error) {
    return next(error);
  }
}

export async function listData(req, res, next) {
  try {
    const filters = listQuerySchema.parse(req.query);
    const offset = (filters.page - 1) * filters.limit;

    const where = [];
    const params = [];

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

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    params.push(filters.limit);
    const limitParam = `$${params.length}`;
    params.push(offset);
    const offsetParam = `$${params.length}`;

    const rowsResult = await query(
      `
        SELECT id, source_name, source_type, payload, uploaded_by, uploaded_at
        FROM raw_data
        ${whereSql}
        ORDER BY uploaded_at DESC
        LIMIT ${limitParam} OFFSET ${offsetParam}
      `,
      params
    );

    const countParams = params.slice(0, params.length - 2);
    const countResult = await query(`SELECT COUNT(*)::int AS total FROM raw_data ${whereSql}`, countParams);

    return res.json({
      page: filters.page,
      limit: filters.limit,
      total: countResult.rows[0]?.total || 0,
      items: rowsResult.rows
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPareto(req, res, next) {
  try {
    const filters = paretoQuerySchema.parse(req.query);

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

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    params.push(filters.top);

    const paretoResult = await query(
      `
        SELECT COALESCE(payload->>'causa', 'Sin causa') AS causa,
               COUNT(*)::int AS total
        FROM raw_data
        ${whereSql}
        GROUP BY COALESCE(payload->>'causa', 'Sin causa')
        ORDER BY total DESC
        LIMIT $${params.length}
      `,
      params
    );

    const totalCountResult = await query(
      `
        SELECT COUNT(*)::int AS total
        FROM raw_data
        ${whereSql}
      `,
      params.slice(0, params.length - 1)
    );

    const grandTotal = totalCountResult.rows[0]?.total || 0;
    let accumulated = 0;

    const items = paretoResult.rows.map((row) => {
      accumulated += row.total;
      const percentage = grandTotal ? Number(((row.total / grandTotal) * 100).toFixed(2)) : 0;
      const accumulatedPercentage = grandTotal ? Number(((accumulated / grandTotal) * 100).toFixed(2)) : 0;

      return {
        causa: row.causa,
        total: row.total,
        percentage,
        accumulatedPercentage
      };
    });

    return res.json({
      totalRecords: grandTotal,
      items
    });
  } catch (error) {
    return next(error);
  }
}
