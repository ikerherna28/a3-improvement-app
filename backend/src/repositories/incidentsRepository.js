import { getPool } from "../db/pool.js";

function mapIncidentDbToApi(row) {
  return {
    id: row.id,
    title: row.title,
    area: row.area,
    problemDescription: row.problem_description,
    rootCause: row.root_cause,
    correctiveAction: row.corrective_action,
    status: row.status,
    priority: row.priority,
    owner: row.owner,
    dueDate: row.due_date,
    closedAt: row.closed_at,
    aiSummary: row.ai_summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function createIncident(input) {
  const pool = getPool();
  const result = await pool.query(
    `
      INSERT INTO incidents (
        title,
        area,
        problem_description,
        root_cause,
        corrective_action,
        status,
        priority,
        owner,
        due_date
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `,
    [
      input.title,
      input.area,
      input.problemDescription,
      input.rootCause || null,
      input.correctiveAction || null,
      input.status || "open",
      input.priority || "medium",
      input.owner || null,
      input.dueDate || null
    ]
  );

  return mapIncidentDbToApi(result.rows[0]);
}

export async function findIncidentById(id) {
  const pool = getPool();
  const result = await pool.query("SELECT * FROM incidents WHERE id = $1", [id]);
  if (!result.rowCount) {
    return null;
  }
  return mapIncidentDbToApi(result.rows[0]);
}

export async function listIncidents(filters = {}) {
  const pool = getPool();
  const where = [];
  const values = [];

  if (filters.status) {
    values.push(filters.status);
    where.push(`status = $${values.length}`);
  }

  if (filters.area) {
    values.push(filters.area);
    where.push(`area = $${values.length}`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const result = await pool.query(
    `SELECT * FROM incidents ${whereSql} ORDER BY created_at DESC LIMIT 200`,
    values
  );

  return result.rows.map(mapIncidentDbToApi);
}

export async function updateIncidentStatus(id, status) {
  const pool = getPool();
  const closedAt = status === "closed" ? "NOW()" : "NULL";

  const result = await pool.query(
    `
      UPDATE incidents
      SET
        status = $2,
        closed_at = ${closedAt},
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [id, status]
  );

  if (!result.rowCount) {
    return null;
  }

  return mapIncidentDbToApi(result.rows[0]);
}

export async function saveAiSummary(id, aiSummary) {
  const pool = getPool();
  const result = await pool.query(
    `
      UPDATE incidents
      SET
        ai_summary = $2,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [id, aiSummary]
  );

  if (!result.rowCount) {
    return null;
  }

  return mapIncidentDbToApi(result.rows[0]);
}

export async function getIncidentStats() {
  const pool = getPool();
  const statusResult = await pool.query(
    "SELECT status, COUNT(*)::int AS total FROM incidents GROUP BY status ORDER BY status"
  );

  const priorityResult = await pool.query(
    "SELECT priority, COUNT(*)::int AS total FROM incidents GROUP BY priority ORDER BY priority"
  );

  return {
    byStatus: statusResult.rows,
    byPriority: priorityResult.rows
  };
}
