import mongoose from "mongoose";

const uploadStatsSchema = new mongoose.Schema(
  {
    totalUploads: {
      type: Number,
      default: 0,
    },
    charts: {
      bar: { type: Number, default: 0 },
      line: { type: Number, default: 0 },
      pie: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const UploadStats = mongoose.model("UploadStats", uploadStatsSchema);

export default UploadStats;