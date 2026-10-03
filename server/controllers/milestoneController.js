const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const Notification = require('../models/Notification'); // For Milestone notifications
const { createActivity } = require("../utils/createActivity");

// Helper to verify project access
const verifyProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  
  const isOwner = project.owner.toString() === userId.toString();
  const memberRecord = project.members.find(m => m.user.toString() === userId.toString());
  
  if (!isOwner && !memberRecord) return null;
  
  return { 
    project, 
    isOwner, 
    role: isOwner ? 'owner' : memberRecord.role 
  };
};

// GET /api/projects/:projectId/milestones
exports.getMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const access = await verifyProjectAccess(projectId, userId);
    if (!access) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    const milestones = await Milestone.find({ project: projectId })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1, createdAt: -1 });

    res.json({ milestones });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ message: 'Server error fetching milestones' });
  }
};

// POST /api/projects/:projectId/milestones
exports.createMilestone = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const access = await verifyProjectAccess(projectId, userId);
    if (!access) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    if (access.role === 'viewer') {
      return res.status(403).json({ message: 'Viewers cannot create milestones' });
    }

    const { title, description, assignedTo, status, progress, startDate, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Verify assignedTo user is in the project
    let validatedAssignee = null;
    if (assignedTo) {
      const isAssigneeOwner = access.project.owner.toString() === assignedTo.toString();
      const isAssigneeMember = access.project.members.some(m => m.user.toString() === assignedTo.toString());
      if (!isAssigneeOwner && !isAssigneeMember) {
        return res.status(400).json({ message: 'Assigned user must be a project member' });
      }
      validatedAssignee = assignedTo;
    }

    // Validate progress
    let finalProgress = parseInt(progress) || 0;
    if (finalProgress < 0 || finalProgress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    let finalStatus = status || 'not_started';
    if (finalStatus === 'completed') finalProgress = 100;
    if (finalStatus === 'not_started') finalProgress = 0;
    if (finalProgress === 100) finalStatus = 'completed';

    // Validate dates
    if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
      return res.status(400).json({ message: 'Start date cannot be after due date' });
    }

    const milestone = await Milestone.create({
      title,
      description,
      project: projectId,
      createdBy: userId,
      assignedTo: validatedAssignee,
      status: finalStatus,
      progress: finalProgress,
      startDate,
      dueDate
    });

    await milestone.populate('createdBy', 'name email');
    if (validatedAssignee) {
      await milestone.populate('assignedTo', 'name email');
    }

    // Notification
    if (validatedAssignee && validatedAssignee.toString() !== userId.toString()) {
      await Notification.create({
        recipient: validatedAssignee,
        type: 'milestone_assigned',
        project: projectId,
        milestone: milestone._id,
        title: 'Milestone Assigned',
        message: `You have been assigned to milestone: ${title}`
      });
    }

    await createActivity({
      actor: req.user._id,
      project: projectId,
      type: 'MILESTONE_CREATED',
      entityType: 'milestone',
      entityId: milestone._id,
      message: `created milestone "${milestone.title}"`
    });

    res.status(201).json({ milestone });
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ message: 'Server error creating milestone' });
  }
};

// GET /api/milestones/:id
exports.getMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const access = await verifyProjectAccess(milestone.project, req.user._id);
    if (!access) {
      return res.status(403).json({ message: 'Not authorized to access this milestone' });
    }

    res.json({ milestone });
  } catch (error) {
    console.error('Error fetching milestone:', error);
    res.status(500).json({ message: 'Server error fetching milestone' });
  }
};

// PUT /api/milestones/:id
exports.updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const userId = req.user._id;
    const access = await verifyProjectAccess(milestone.project, userId);
    
    if (!access) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    if (access.role === 'viewer') {
      return res.status(403).json({ message: 'Viewers cannot edit milestones' });
    }

    // Researchers can only edit if they created it or it's assigned to them
    if (access.role === 'researcher') {
      const isCreator = milestone.createdBy.toString() === userId.toString();
      const isAssignee = milestone.assignedTo && milestone.assignedTo.toString() === userId.toString();
      
      if (!isCreator && !isAssignee) {
        return res.status(403).json({ message: 'You can only edit milestones you created or are assigned to' });
      }
    }

    const { title, description, assignedTo, status, progress, startDate, dueDate } = req.body;

    if (title) milestone.title = title;
    if (description !== undefined) milestone.description = description;
    
    // Assignment updates
    const oldAssignee = milestone.assignedTo ? milestone.assignedTo.toString() : null;
    let newAssignee = assignedTo;

    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === '') {
        milestone.assignedTo = null;
        newAssignee = null;
      } else {
        const isAssigneeOwner = access.project.owner.toString() === assignedTo.toString();
        const isAssigneeMember = access.project.members.some(m => m.user.toString() === assignedTo.toString());
        if (!isAssigneeOwner && !isAssigneeMember) {
          return res.status(400).json({ message: 'Assigned user must be a project member' });
        }
        milestone.assignedTo = assignedTo;
      }
    }

    // Handle status & progress
    let finalStatus = status !== undefined ? status : milestone.status;
    let finalProgress = progress !== undefined ? parseInt(progress) : milestone.progress;
    
    if (finalProgress < 0 || finalProgress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    // Status transition enforcement
    if (status !== undefined && status !== milestone.status) {
       // Check backwards transitions
       if (milestone.status === 'completed' && (status === 'in_progress' || status === 'not_started')) {
          return res.status(400).json({ message: 'Cannot move a completed milestone backwards' });
       }
       if (milestone.status === 'in_progress' && status === 'not_started') {
          return res.status(400).json({ message: 'Cannot move an in-progress milestone to not started' });
       }
    }

    if (finalStatus === 'completed') finalProgress = 100;
    if (finalStatus === 'not_started') finalProgress = 0;
    if (finalProgress === 100) finalStatus = 'completed';

    milestone.status = finalStatus;
    milestone.progress = finalProgress;

    // Handle dates
    if (startDate !== undefined) milestone.startDate = startDate || null;
    if (dueDate !== undefined) milestone.dueDate = dueDate || null;

    if (milestone.startDate && milestone.dueDate && new Date(milestone.startDate) > new Date(milestone.dueDate)) {
      return res.status(400).json({ message: 'Start date cannot be after due date' });
    }

    await milestone.save();
    
    // Populate for response
    await milestone.populate('createdBy', 'name email');
    if (milestone.assignedTo) {
      await milestone.populate('assignedTo', 'name email');
    }

    // Notifications
    if (newAssignee && newAssignee.toString() !== oldAssignee && newAssignee.toString() !== userId.toString()) {
       await Notification.create({
         recipient: newAssignee,
         type: 'milestone_assigned',
         project: milestone.project,
         milestone: milestone._id,
         title: 'Milestone Assigned',
         message: `You have been assigned to milestone: ${milestone.title}`
       });
    }

    // Completion notification to project owner if a member completed it
    if (milestone.status === 'completed' && req.body.status && access.project.owner.toString() !== userId.toString()) {
       await Notification.create({
         recipient: access.project.owner,
         type: 'milestone_completed',
         project: milestone.project,
         milestone: milestone._id,
         title: 'Milestone Completed',
         message: `Milestone "${milestone.title}" was completed by a team member.`
       });
    }

    if (milestone.status === 'completed' && req.body.status) {
       await createActivity({
         actor: req.user._id,
         project: milestone.project,
         type: 'MILESTONE_COMPLETED',
         entityType: 'milestone',
         entityId: milestone._id,
         message: `completed milestone "${milestone.title}"`
       });
    }

    res.json({ milestone });
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Server error updating milestone' });
  }
};

// DELETE /api/milestones/:id
exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const userId = req.user._id;
    const access = await verifyProjectAccess(milestone.project, userId);
    
    if (!access) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    if (access.role === 'viewer') {
      return res.status(403).json({ message: 'Viewers cannot delete milestones' });
    }

    if (access.role === 'researcher') {
      if (milestone.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Researchers can only delete milestones they created' });
      }
    }

    await milestone.deleteOne();
    res.json({ message: 'Milestone removed' });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ message: 'Server error deleting milestone' });
  }
};

// PATCH /api/milestones/:id/status
exports.updateMilestoneStatus = async (req, res) => {
  // Essentially the same as update, just limited fields
  req.body = { status: req.body.status, progress: req.body.progress };
  return this.updateMilestone(req, res);
};

// PATCH /api/milestones/:id/assign
exports.assignMilestone = async (req, res) => {
  req.body = { assignedTo: req.body.assignedTo };
  return this.updateMilestone(req, res);
};
