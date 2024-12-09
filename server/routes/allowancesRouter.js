import { Router } from "express";
import { createAllowance, getAllowances, getAllowanceById, updateAllowance, deleteAllowance } from "../controllers/allowanceController.js";

const router = Router();

router.get("/", getAllowances);
router.get("/:id", getAllowanceById);

router.post("/", createAllowance);
router.patch("/:id", updateAllowance);
router.delete("/:id", deleteAllowance);


export default router;
