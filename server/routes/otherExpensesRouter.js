import { Router } from "express";
import {
  getOtherExpenses,
  createOtherExpense,
  getOtherExpenseId,
  deleteOtherExpense,
} from "../controllers/otherExpensesController.js";

const router = Router();
// /api/other-expenses/
router.get("/", getOtherExpenses);
router.get("/:id", getOtherExpenseId);
router.post("/", createOtherExpense);
router.delete("/:id", deleteOtherExpense);

export default router;
