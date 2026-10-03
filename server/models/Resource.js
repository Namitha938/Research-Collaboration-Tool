const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["link", "dataset", "repository", "file", "reference"],
      required: true,
    },
    url: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
    fileType: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    tags: {
      type: [String],
      default: [],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for getting project resources quickly
resourceSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model("Resource", resourceSchema);
