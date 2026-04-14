import { Router } from "express";

import { getPareto, listData, uploadData } from "../controllers/dataController.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/upload", upload.single("file"), uploadData);
router.get("/list", listData);
router.get("/pareto", getPareto);

export default router;
