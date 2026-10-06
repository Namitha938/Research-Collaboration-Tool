const cron = require("node-cron");
const Task = require("../models/Task");
const Milestone = require("../models/Milestone");
const Notification = require("../models/Notification");
const createNotification = require("./createNotification");

const processReminders = async () => {
  try {
    const now = new Date();
    const msIn24Hours = 24 * 60 * 60 * 1000;

    // --- 1. Process Tasks ---
    const activeTasks = await Task.find({
      dueDate: { $ne: null },
      status: { $ne: "completed" },
    }).populate("project", "title");

    for (const task of activeTasks) {
      const timeRemaining = task.dueDate.getTime() - now.getTime();
      const isOverdue = timeRemaining < 0;
      const isUpcoming = timeRemaining >= 0 && timeRemaining <= msIn24Hours;

      if (isOverdue || isUpcoming) {
        const type = isOverdue ? "task_overdue" : "task_deadline_reminder";
        const title = isOverdue ? "Task Overdue" : "Upcoming Task Deadline";
        const message = isOverdue
          ? `Your task "${task.title}" in project "${task.project?.title || "Unknown"}" is overdue.`
          : `Your task "${task.title}" in project "${task.project?.title || "Unknown"}" is due within 24 hours.`;

        // Check for duplicates for this EXACT deadline value
        const existing = await Notification.findOne({
          task: task._id,
          type: type,
          dueDate: task.dueDate,
        });

        if (!existing) {
          const recipient = task.assignedTo || task.createdBy;
          if (recipient) {
            await createNotification({
              recipient,
              type,
              title,
              message,
              project: task.project?._id,
              task: task._id,
              dueDate: task.dueDate,
            });
          }
        }
      }
    }

    // --- 2. Process Milestones ---
    const activeMilestones = await Milestone.find({
      dueDate: { $ne: null },
      status: { $ne: "completed" },
    }).populate("project", "title");

    for (const milestone of activeMilestones) {
      const timeRemaining = milestone.dueDate.getTime() - now.getTime();
      const isOverdue = timeRemaining < 0;
      const isUpcoming = timeRemaining >= 0 && timeRemaining <= msIn24Hours;

      if (isOverdue || isUpcoming) {
        const type = isOverdue ? "milestone_overdue" : "milestone_deadline_reminder";
        const title = isOverdue ? "Milestone Overdue" : "Upcoming Milestone Deadline";
        const message = isOverdue
          ? `Milestone "${milestone.title}" in project "${milestone.project?.title || "Unknown"}" is overdue.`
          : `Milestone "${milestone.title}" in project "${milestone.project?.title || "Unknown"}" is due within 24 hours.`;

        // Check for duplicates for this EXACT deadline value
        const existing = await Notification.findOne({
          milestone: milestone._id,
          type: type,
          dueDate: milestone.dueDate,
        });

        if (!existing) {
          const recipient = milestone.assignedTo || milestone.createdBy;
          if (recipient) {
            await createNotification({
              recipient,
              type,
              title,
              message,
              project: milestone.project?._id,
              milestone: milestone._id,
              dueDate: milestone.dueDate,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error processing reminders:", error);
  }
};

const startReminderJob = () => {
  // Run every 1 hour
  cron.schedule("0 * * * *", () => {
    console.log("[CRON] Running deadline reminder check...");
    processReminders();
  });
  console.log("[CRON] Reminder job initialized.");
};

module.exports = { startReminderJob, processReminders };
