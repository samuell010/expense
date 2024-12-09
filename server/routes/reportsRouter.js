import { Router } from "express";
import {
  getReportWithTrip,
  createReport,
  getReports,
  getPaginatedReports,
  getReportById,
  updateReport,
  deleteReport,
  deleteReports,
  getLatestDraftReport,
} from "../controllers/reportsController.js";
import { validateReport } from "../middleware/validationMiddleware.js";

const router = Router();

router.get("/", getReports);
router.get("/paginated-reports", getPaginatedReports);
router.get("/latest-draft", getLatestDraftReport);
router.get("/:id", getReportById);

router.post("/", validateReport, createReport);
router.patch("/:id", updateReport);
router.delete("/delete-many", deleteReports);
router.delete("/:id", deleteReport);

export default router;
