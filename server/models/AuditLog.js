const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    // Who performed the action. Null for system/anonymous events (e.g. failed login).
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Denormalized snapshot so the trail survives user deletion.
    actorName: { type: String, default: "System", trim: true },
    actorEmail: { type: String, default: "", trim: true },
    actorRole: {
      type: String,
      enum: ["admin", "researcher", "guest", "system"],
      default: "system",
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["auth", "profile", "project", "admin", "security"],
      default: "auth",
      index: true,
    },
    entityType: { type: String, default: "", trim: true },
    entityId: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["success", "failure"],
      default: "success",
    },
    ipAddress: { type: String, default: "", trim: true },
    userAgent: { type: String, default: "", trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);