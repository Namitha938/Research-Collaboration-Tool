const Notification = require("../models/Notification");

/**
 * Creates a notification safely.
 * @param {Object} data 
 * @param {ObjectId} data.recipient
 * @param {String} data.type
 * @param {String} data.title
 * @param {String} data.message
 * @param {ObjectId} [data.project]
 * @param {ObjectId} [data.task]
 * @param {ObjectId} [data.invitation]
 * @returns {Promise<Object|null>} Returns the created notification or null if error.
 */
const createNotification = async (data) => {
  try {
    const { recipient, type, title, message, project, task, invitation } = data;

    if (!recipient || !type || !title || !message) {
      console.error("createNotification missing required fields:", data);
      return null;
    }

    const validTypes = [
      "project_invitation",
      "invitation_accepted",
      "invitation_rejected",
      "member_added",
      "role_changed",
      "member_removed",
      "task_assigned",
      "task_reassigned",
      "task_completed",
    ];

    if (!validTypes.includes(type)) {
      console.error(`createNotification invalid type: ${type}`);
      return null;
    }

    const notification = new Notification({
      recipient,
      type,
      title,
      message,
      project,
      task,
      invitation,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("createNotification error:", error);
    return null;
  }
};

module.exports = createNotification;
