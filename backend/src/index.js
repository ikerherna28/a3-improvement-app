import { startServer } from "./server.js";

startServer().catch((error) => {
  console.error("No se pudo iniciar el backend:", error);
  process.exit(1);
});
