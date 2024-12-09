import { createAttachment, getAttachements } from "../controllers/attachementController.js";
import { Router } from "express";




const router = Router();

router.get("/", getAttachements)
router.post("/", createAttachment)

export default router;