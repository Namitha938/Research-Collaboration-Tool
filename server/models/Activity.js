const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'PROJECT_CREATED',
        'PROJECT_UPDATED',
        'MEMBER_INVITED',
        'MEMBER_JOINED',
        'MEMBER_REMOVED',
        'MEMBER_ROLE_CHANGED',
        'TASK_CREATED',
        'TASK_ASSIGNED',
        'TASK_REASSIGNED',
        'TASK_COMPLETED',
        'DOCUMENT_UPLOADED',
        'DOCUMENT_DELETED',
        'RESOURCE_ADDED',
        'RESOURCE_DELETED',
        'RESEARCH_PAPER_ADDED',
        'RESEARCH_PAPER_DELETED',
        'REFERENCE_ADDED',
        'MILESTONE_CREATED',
        'MILESTONE_COMPLETED'
      ]
    },
    entityType: {
      type: String,
      enum: ['project', 'user', 'task', 'document', 'resource', 'researchPaper', 'reference', 'milestone', null],
      default: null
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    message: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

// Index for efficient timeline querying
activitySchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
