import { Router } from "express";
import {
  getKilometerAllowances,
  createKilometerAllowance,
  updateKilometerAllowance,
  deleteKilometerAllowance,
  getKilometerAllowancesByTripId,
  getKilometerAllowanceById,
} from "../controllers/kilometerAllowanceController.js";
import { validateKilometerAllowance } from "../middleware/validationMiddleware.js";

const router = Router();

router.get("/", getKilometerAllowances);
router.get("/:id", getKilometerAllowanceById);
router.get("/kilometer-allowances-by-trip-id", getKilometerAllowancesByTripId);
router.post("/", validateKilometerAllowance, createKilometerAllowance);
router.patch("/:id", updateKilometerAllowance);
router.delete("/:id", deleteKilometerAllowance);


export default router;
