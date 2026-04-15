import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  databaseUrl: process.env.DATABASE_URL || "",
  dbConnectionTimeoutMs: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 5000),
  dbFallbackToMemory: (process.env.DB_FALLBACK_TO_MEMORY || "true").toLowerCase() === "true",
  autoMigrate: (process.env.AUTO_MIGRATE || "true").toLowerCase() === "true",
  jwtSecret: process.env.JWT_SECRET || "dev_jwt_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  googleAiApiKey: process.env.GOOGLE_AI_API_KEY || "",
  googleAiModel: process.env.GOOGLE_AI_MODEL || "gemini-1.5-flash"
};
