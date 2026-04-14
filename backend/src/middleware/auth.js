import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "Token invalido o expirado" });
  }
}
