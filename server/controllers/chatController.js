const Message = require("../models/Message");
const Project = require("../models/Project");

// @desc    Get message history for a project
// @route   GET /api/chat/:projectId
// @access  Private
const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some((m) => m.toString() === req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ success: false, message: "Not authorized to access this project chat" });
    }

    const messages = await Message.find({ project: projectId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getProjectMessages,
};

