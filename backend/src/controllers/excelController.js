import XLSX from "xlsx";

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
