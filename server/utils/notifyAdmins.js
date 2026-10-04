const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * Creates a notification for all admin users.
 * @param {Object} data 
 * @param {String} data.type
 * @param {String} data.title
 * @param {String} data.message
 * @param {ObjectId} [data.project]
 * @returns {Promise<void>}
 */
const notifyAdmins = async (data) => {
  try {
    const { type, title, message, project } = data;

    if (!type || !title || !message) {
      console.error("notifyAdmins missing required fields:", data);
      return;
    }

    const validTypes = [
      "admin_new_user",
      "admin_new_project",
      "admin_project_completed",
    ];

    if (!validTypes.includes(type)) {
      console.error(`notifyAdmins invalid type: ${type}`);
      return;
    }

    // Find all users with role 'admin'
    const admins = await User.find({ role: "admin" }).select("_id");
    
    if (admins.length === 0) return;

    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      type,
      title,
      message,
      project: project || null,
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error("notifyAdmins error:", error);
  }
};

module.exports = notifyAdmins;
