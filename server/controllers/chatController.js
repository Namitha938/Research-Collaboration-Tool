const Message = require('../models/Message');
const Project = require('../models/Project');

const checkProjectMembership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, role: null };

  const isOwner = project.owner.toString() === userId.toString();
  const member = project.members.find((m) => m.user?.toString() === userId.toString());

  if (isOwner) return { project, role: "owner" };
  if (member) return { project, role: member.role };
  return { project, role: null };
};

exports.getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (!role) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this project chat' });
    }

    const skip = (page - 1) * limit;

    // Fetch newest messages first (createdAt descending), then we can reverse them on frontend or backend
    const messages = await Message.find({ project: projectId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sender', 'name email');

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error fetching messages' });
  }
};
