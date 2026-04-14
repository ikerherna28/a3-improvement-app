import { z } from "zod";

const statusValues = ["open", "in_progress", "blocked", "closed"];
const priorityValues = ["low", "medium", "high", "critical"];

export const createIncidentSchema = z.object({
  title: z.string().trim().min(3).max(200),
  area: z.string().trim().min(2).max(120),
  problemDescription: z.string().trim().min(10),
  rootCause: z.string().trim().optional(),
  correctiveAction: z.string().trim().optional(),
  status: z.enum(statusValues).optional(),
  priority: z.enum(priorityValues).optional(),
  owner: z.string().trim().max(120).optional(),
  dueDate: z.string().date().optional()
});

export const updateIncidentStatusSchema = z.object({
  status: z.enum(statusValues)
});
