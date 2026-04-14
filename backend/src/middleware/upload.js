import multer from "multer";

import { HttpError } from "../utils/httpError.js";

const allowedMimes = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/csv",
  "application/octet-stream"
]);

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  const fileName = file.originalname.toLowerCase();
  const hasValidExtension = fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".csv");
  const hasValidMime = allowedMimes.has(file.mimetype);

  if (!hasValidExtension || !hasValidMime) {
    cb(new HttpError(400, "Formato no soportado. Usa Excel (.xlsx/.xls) o CSV."));
    return;
  }

  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024
  }
});
