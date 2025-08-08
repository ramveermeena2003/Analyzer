import express from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";
import UploadStats from "../models/UploadStats.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", protectRoute, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    // Upload to Cloudinary using Promise
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw", folder: "excel_files" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });

    const result = await uploadStream();

    // Save to DB
    const user = await User.findById(userId);
    user.history.push({
      fileUrl: result.secure_url,
      fileName: file.originalname,
    });

    let stats = await UploadStats.findOne();
    if (!stats) {
      stats = new UploadStats(); // will start with default values (0)
    }
    stats.totalUploads += 1;
    await stats.save();

    
    await user.save();

    res.status(200).json({ message: "Uploaded successfully", fileUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all uploaded files for a user
router.get("/", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.history || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history", error: err.message });
  }
});

// Delete a specific file from history
router.delete("/:fileId", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const fileId = req.params.fileId;

    // Find the file in the user's history
    const fileItem = user.history.find((item) => item._id.toString() === fileId);
    if (!fileItem) {
      return res.status(404).json({ message: "File not found in DB" });
    }

    // Extract Cloudinary public ID
    const fileNameWithExt = fileItem.fileUrl.split("/").pop();
    const publicId = `excel_files/${fileNameWithExt.split(".")[0]}`;

    // 🔥 Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

    // ✅ Remove from MongoDB manually
    user.history = user.history.filter((item) => item._id.toString() !== fileId);
    user.markModified("history"); // Important for nested array update tracking
    await user.save();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("🔥 Deletion failed:", err);
    res.status(500).json({ message: "Failed to delete file", error: err.message });
  }
});



export default router;
