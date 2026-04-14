export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export function createNotFound(message = "Recurso no encontrado") {
  return new HttpError(404, message);
}

export function createBadRequest(message = "Solicitud invalida") {
  return new HttpError(400, message);
}
