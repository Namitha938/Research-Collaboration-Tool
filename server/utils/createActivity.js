const Activity = require('../models/Activity');

/**
 * Creates an activity record for a project without blocking the main request flow.
 * Any errors in activity creation are caught and logged so the parent operation succeeds.
 * 
 * @param {Object} options
 * @param {ObjectId|string} options.actor - The user who performed the action (req.user._id)
 * @param {ObjectId|string} options.project - The project this activity belongs to
 * @param {string} options.type - ENUM value (e.g., 'PROJECT_CREATED', 'TASK_COMPLETED')
 * @param {string} [options.entityType] - The type of entity (e.g., 'task', 'document')
 * @param {ObjectId|string} [options.entityId] - The ID of the entity
 * @param {string} options.message - Human readable description (e.g., "John completed task 'Dataset'")
 * @param {Object} [options.metadata] - Extra details
 */
const createActivity = async ({
  actor,
  project,
  type,
  entityType = null,
  entityId = null,
  message,
  metadata = {}
}) => {
  try {
    if (!actor || !project || !type || !message) {
      console.warn('Missing required fields for activity logging', { actor, project, type, message });
      return;
    }

    const activity = new Activity({
      actor,
      project,
      type,
      entityType,
      entityId,
      message,
      metadata
    });

    await activity.save();
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

module.exports = { createActivity };
