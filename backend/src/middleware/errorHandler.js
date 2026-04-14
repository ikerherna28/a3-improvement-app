import { ZodError } from "zod";
import multer from "multer";

import { HttpError } from "../utils/httpError.js";

export function notFoundHandler(_req, res) {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: `Error de carga de archivo: ${error.message}`
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Datos invalidos",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  console.error("Error no controlado:", error);
  return res.status(500).json({
    error: "Error interno del servidor"
  });
}
