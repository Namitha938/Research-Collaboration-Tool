const Message = require("../models/Message");
const Project = require("../models/Project");
const mongoose = require("mongoose");

// @desc    Get message history for a project
// @route   GET /api/chat/:projectId
// @access  Private
const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some((m) => (m.user?._id || m.user || m).toString() === req.user._id.toString());

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

// @desc    Edit a message
// @route   PATCH /api/chat/messages/:messageId
// @access  Private
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Content cannot be empty" });
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ success: false, message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId).populate("project");
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.deleted) {
      return res.status(400).json({ success: false, message: "Cannot edit a deleted message" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this message" });
    }

    const project = message.project;
    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some((m) => (m.user?._id || m.user || m).toString() === req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ success: false, message: "Not authorized to access this project" });
    }

    message.content = content.trim();
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    const populatedMessage = await Message.findById(messageId).populate("sender", "name email");

    // We can also emit socket event here if we had access to IO, but typical flow will have client emit via socket directly
    res.json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error("Edit message error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete a message (soft delete)
// @route   DELETE /api/chat/messages/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ success: false, message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId).populate("project");
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this message" });
    }

    const project = message.project;
    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some((m) => (m.user?._id || m.user || m).toString() === req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ success: false, message: "Not authorized to access this project" });
    }

    message.deleted = true;
    message.deletedAt = new Date();
    message.content = "Message deleted";
    await message.save();

    res.json({ success: true, message: "Message deleted successfully", deletedMessageId: messageId });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getProjectMessages,
  editMessage,
  deleteMessage,
};

