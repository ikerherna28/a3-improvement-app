import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "../config/env.js";
import { query } from "../config/database.js";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  role: z.enum(["admin", "user"]).optional()
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72)
});

function buildToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function register(req, res, next) {
  try {
    const payload = registerSchema.parse(req.body);

    const existingUser = await query("SELECT id FROM users WHERE email = $1", [payload.email]);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({ error: "El email ya esta registrado" });
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const result = await query(
      `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at
      `,
      [payload.name, payload.email, passwordHash, payload.role || "user"]
    );

    const user = result.rows[0];
    const token = buildToken(user);

    return res.status(201).json({ user, token });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);

    const result = await query(
      `
        SELECT id, name, email, role, password_hash
        FROM users
        WHERE email = $1
      `,
      [payload.email]
    );

    if (!result.rowCount) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(payload.password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const token = buildToken(user);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    return next(error);
  }
}
