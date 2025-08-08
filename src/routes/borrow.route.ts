import { Router } from "express";
import { borrowBook, getBorrowBooksSummary } from "../controllers/borrow.controller";

const router = Router();

router.post("/", borrowBook);
router.get("/", getBorrowBooksSummary);

export default router;