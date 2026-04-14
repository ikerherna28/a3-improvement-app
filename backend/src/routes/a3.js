import { Router } from "express";

import {
	changeA3Status,
	createA3,
	downloadA3Pdf,
	getA3,
	listA3,
	updateA3
} from "../controllers/a3Controller.js";

const router = Router();

router.post("/create", createA3);
router.get("/list", listA3);
router.get("/:id/pdf", downloadA3Pdf);
router.get("/:id", getA3);
router.put("/:id", updateA3);
router.patch("/:id/status", changeA3Status);

export default router;
