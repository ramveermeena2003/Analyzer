import XLSX from "xlsx";

import UploadStats from "../models/UploadStats.js";

export const uploadExcelFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const preview = jsonData.slice(0, 5); // return only first 5 rows
    const headers = Object.keys(jsonData[0] || {});

    res.status(200).json({ success: true, data: preview, headers });
  } catch (error) {
    console.error("Excel Upload Error:", error);
    res.status(500).json({ message: "Failed to process file" });
  }
};

export const updateStats = async (req, res) => {
  try {
    const { chartTypes } = req.body;

    // Find the single stats document (or create if not exists)
    let stats = await UploadStats.findOne();
    if (!stats) {
      stats = new UploadStats(); // defaults already set in schema
    }

    // Increment the corresponding chart count
    if (chartTypes === "bar") {
      stats.charts.bar += 1;
    } else if (chartTypes === "line") {
      stats.charts.line += 1;
    } else if (chartTypes === "pie") {
      stats.charts.pie += 1;
    }

    // Save updated stats
    await stats.save();

    res.status(200).json({
      success: true,
      message: "Stats updated successfully",
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update stats",
      error: error.message,
    });
  }
};
export const getStats = async (req,res) => {
  try{
    const stats = await UploadStats.findOne();
    if(!stats){
      return res.status(404).json({message: "No stats found"});
    }
    res.status(200).json({success : true, stats});
  }
  catch(error){
    res.status(500).json({success: false, message: "Failed to fetch stats", error : error.message});
  }
}