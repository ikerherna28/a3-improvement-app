import { Router } from "express";

import {
  generateAnalisis,
  generateCausaRaiz,
  generateEstandarizacion,
  generatePlanAccion
} from "../controllers/aiController.js";

const router = Router();

router.post("/generate-analisis", generateAnalisis);
router.post("/generate-causa-raiz", generateCausaRaiz);
router.post("/generate-plan-accion", generatePlanAccion);
router.post("/generate-estandarizacion", generateEstandarizacion);

export default router;
