import express from "express";
import upload from "../middleware/upload.js";
import { uploadExcelFile } from "../controllers/excelController.js";

const router = express.Router();

router.post("/upload", upload.single("excelFile"), uploadExcelFile);

export default router;
