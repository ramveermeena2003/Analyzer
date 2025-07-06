import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.memoryStorage();

// File filter for Excel files only
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".xls" && ext !== ".xlsx") {
    return cb(new Error("Only Excel files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
