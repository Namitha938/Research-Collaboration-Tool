const express = require('express');
const router = express.Router();
const {
  getMilestones,
  createMilestone,
  getMilestone,
  updateMilestone,
  deleteMilestone,
  updateMilestoneStatus,
  assignMilestone
} = require('../controllers/milestoneController');

const protect = require('../middleware/authMiddleware');

// Project-level routes
router.route('/projects/:projectId/milestones')
  .get(protect, getMilestones)
  .post(protect, createMilestone);

// Milestone-level routes
router.route('/milestones/:id')
  .get(protect, getMilestone)
  .put(protect, updateMilestone)
  .delete(protect, deleteMilestone);

router.patch('/milestones/:id/status', protect, updateMilestoneStatus);
router.patch('/milestones/:id/assign', protect, assignMilestone);

module.exports = router;
