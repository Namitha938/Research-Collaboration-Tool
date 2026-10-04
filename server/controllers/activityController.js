const Activity = require('../models/Activity');
const Project = require('../models/Project');
const mongoose = require('mongoose');

// Helper to verify user is part of the project
const verifyProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  
  if (project.owner && project.owner.toString() === userId.toString()) return project;
  
  const isMember = project.members && project.members.some(
    member => member.user && member.user.toString() === userId.toString()
  );
  
  return isMember ? project : null;
};

// @desc    Get activities for a project
// @route   GET /api/projects/:projectId/activities
// @access  Private
const getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    
    // Max limit 50
    if (limit > 50) limit = 50;

    const project = await verifyProjectAccess(projectId, req.user._id);
    if (!project) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    const skip = (page - 1) * limit;

    const activities = await Activity.find({ project: projectId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actor', 'name email avatar') // Only safe fields
      .exec();

    const total = await Activity.countDocuments({ project: projectId });

    res.json({
      success: true,
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
};

module.exports = {
  getProjectActivities
};
