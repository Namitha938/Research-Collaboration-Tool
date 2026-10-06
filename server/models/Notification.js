const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "project_invitation",
        "invitation_accepted",
        "invitation_rejected",
        "member_added",
        "role_changed",
        "member_removed",
        "task_assigned",
        "task_reassigned",
        "task_completed",
        "milestone_assigned",
        "milestone_reassigned",
        "milestone_completed",
        "admin_new_user",
        "admin_new_project",
        "admin_project_completed",
        "document_commented",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    milestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
    invitation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invitation",
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes to speed up common queries
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
