import { Router } from "express";
import { previewPdf } from "../controllers/pdfController.js";

const router = Router();

router.get("/", previewPdf);


export default router;
