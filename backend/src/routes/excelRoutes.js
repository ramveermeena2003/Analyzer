import express from "express";
import upload from "../middleware/upload.js";
import { getStats, updateStats, uploadExcelFile } from "../controllers/excelController.js";

const router = express.Router();

router.post("/upload", upload.single("excelFile"), uploadExcelFile);
router.post("/update-stats",updateStats);
router.get("/get-stats",getStats);

export default router;
