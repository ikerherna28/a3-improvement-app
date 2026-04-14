import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { initializeDatabase } from "./config/database.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.use("/api", apiRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "A3 Improvement API en linea",
    docs: ["/api/health", "/api/auth/register", "/api/auth/login"]
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export async function startServer() {
  const dbInfo = await initializeDatabase();
  console.log(`Base de datos activa en modo: ${dbInfo.mode}`);

  app.listen(env.port, () => {
    console.log(`Backend escuchando en http://localhost:${env.port}`);
  });
}

export default app;
