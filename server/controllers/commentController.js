const Comment = require("../models/Comment");
const Document = require("../models/Document");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const { createActivity } = require("../utils/createActivity");

// Helper to check project membership
const checkProjectMembership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, role: null };

  const isOwner = project.owner.toString() === userId.toString();
  const member = project.members.find((m) => m.user?.toString() === userId.toString());

  if (isOwner) return { project, role: "owner" };
  if (member) return { project, role: member.role };
  return { project, role: null };
};

// @desc    Get comments for a document
// @route   GET /api/projects/:projectId/documents/:documentId/comments
// @access  Private (Owner, Researcher, Viewer)
const getComments = async (req, res) => {
  try {
    const { projectId, documentId } = req.params;

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (!role) return res.status(403).json({ success: false, message: "Not authorized to access this project" });

    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ success: false, message: "Document not found" });
    if (document.project.toString() !== projectId) {
      return res.status(400).json({ success: false, message: "Document does not belong to this project" });
    }

    const comments = await Comment.find({ document: documentId })
      .populate("author", "name email avatar")
      .sort({ createdAt: 1 }); // oldest first

    res.json({ success: true, comments, currentUserRole: role });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Add a comment to a document
// @route   POST /api/projects/:projectId/documents/:documentId/comments
// @access  Private (Owner, Researcher)
const addComment = async (req, res) => {
  try {
    const { projectId, documentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Comment content is required" });
    }

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (!role) return res.status(403).json({ success: false, message: "Not authorized to access this project" });
    if (role === "viewer") {
      return res.status(403).json({ success: false, message: "Viewers cannot add comments" });
    }

    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ success: false, message: "Document not found" });
    if (document.project.toString() !== projectId) {
      return res.status(400).json({ success: false, message: "Document does not belong to this project" });
    }

    const comment = new Comment({
      content: content.trim(),
      document: documentId,
      project: projectId,
      author: req.user._id,
      isEdited: false
    });

    await comment.save();

    await comment.populate("author", "name email avatar");

    // Activity logging
    await createActivity({
      actor: req.user._id,
      project: projectId,
      type: "DOCUMENT_COMMENTED",
      entityType: "document",
      entityId: documentId,
      message: `commented on document "${document.name}"`,
    });

    // Notify document uploader if it's someone else
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      try {
        await Notification.create({
          recipient: document.uploadedBy,
          type: "document_commented",
          title: "New Document Comment",
          message: `${req.user.name} commented on your document "${document.name}" in project "${project.title}"`,
          project: projectId,
          document: documentId,
        });
      } catch (notifErr) {
        console.error("Failed to send notification for comment:", notifErr);
      }
    }

    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Edit a comment
// @route   PUT /api/comments/:commentId
// @access  Private (Author only)
const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Comment content is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // ONLY author can edit
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only edit your own comments" });
    }

    comment.content = content.trim();
    comment.isEdited = true;
    await comment.save();

    await comment.populate("author", "name email avatar");

    res.json({ success: true, comment });
  } catch (error) {
    console.error("Error editing comment:", error);
    // If it's a CastError, the ID might be invalid format
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid comment ID" });
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private (Author only)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // ONLY author can delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own comments" });
    }

    await comment.deleteOne();

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid comment ID" });
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getComments,
  addComment,
  editComment,
  deleteComment,
};
