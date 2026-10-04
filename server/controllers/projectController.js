const Project = require("../models/Project");
const Task = require("../models/Task");
const Document = require("../models/Document");
const Resource = require("../models/Resource");
const ResearchPaper = require("../models/ResearchPaper");
const Reference = require("../models/Reference");
const Milestone = require("../models/Milestone");
const Activity = require("../models/Activity");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const Invitation = require("../models/Invitation");
const cloudinary = require("../config/cloudinary");

const { createActivity } = require("../utils/createActivity");
const notifyAdmins = require("../utils/notifyAdmins");

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description, researchArea, startDate, deadline } = req.body;

    if (!title || !description || !researchArea) {
      return res.status(400).json({ success: false, message: "Please provide title, description, and researchArea" });
    }

    const project = await Project.create({
      title,
      description,
      researchArea,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
      startDate,
      deadline,
      status: "active",
      progress: 0,
    });

    await createActivity({
      actor: req.user._id,
      project: project._id,
      type: 'PROJECT_CREATED',
      entityType: 'project',
      entityId: project._id,
      message: `created the project "${title}"`
    });

    notifyAdmins({
      type: "admin_new_project",
      title: "New Research Project",
      message: `${req.user.name} created the project "${title}".`,
      project: project._id,
    }).catch((err) => console.error(err));

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all projects for authenticated user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // Find projects where the user is either the owner or a member
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    })
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort({ updatedAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Check authorization: must be owner or member
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some((member) => member.user?._id?.toString() === req.user._id.toString());

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: "Not authorized to access this project" });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner only)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Check authorization: only owner can update
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this project. Only the owner can make changes." });
    }

    const { title, description, researchArea, startDate, deadline, status } = req.body;
    
    // Status transition validation
    if (status && status !== project.status) {
      const allowedTransitions = {
        active: ['completed', 'archived'],
        completed: ['archived'],
        archived: [] // No transitions out of archived (or maybe allow back to active? Let's stick to prompt recommendations)
      };
      
      // If the prompt explicitly recommended transitions: active->completed, active->archived, completed->archived
      if (!allowedTransitions[project.status]?.includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid status transition from ${project.status} to ${status}` 
        });
      }
    }

    // Prepare update object safely
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (researchArea) updateData.researchArea = researchArea;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (status) updateData.status = status;

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email");

    // Log specific activities based on what changed
    if (status === 'archived' && project.status !== 'archived') {
      await createActivity({
        actor: req.user._id,
        project: project._id,
        type: 'PROJECT_ARCHIVED',
        entityType: 'project',
        entityId: project._id,
        message: `archived the project`
      });
    } else if (status && status !== project.status) {
      await createActivity({
        actor: req.user._id,
        project: project._id,
        type: 'PROJECT_STATUS_CHANGED',
        entityType: 'project',
        entityId: project._id,
        message: `changed project status to ${status}`
      });
    } else {
      await createActivity({
        actor: req.user._id,
        project: project._id,
        type: 'PROJECT_UPDATED',
        entityType: 'project',
        entityId: project._id,
        message: `updated project details`
      });
    }

    // If status changed to completed
    if (status === "completed" && project.status !== "completed") {
      notifyAdmins({
        type: "admin_project_completed",
        title: "Project Completed",
        message: `"${project.title}" has been marked as completed.`,
        project: project._id,
      }).catch((err) => console.error(err));
    }

    res.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Check authorization: only owner can delete
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this project. Only the owner can delete." });
    }

    // 1. Find and delete Cloudinary assets for Documents
    const documents = await Document.find({ project: projectId });
    for (const doc of documents) {
      if (doc.publicId) {
        await cloudinary.uploader.destroy(doc.publicId).catch(err => console.error("Cloudinary delete error (Document):", err));
      }
    }

    // 2. Find and delete Cloudinary assets for Resources
    const resources = await Resource.find({ project: projectId });
    for (const resDoc of resources) {
      if (resDoc.publicId) {
        await cloudinary.uploader.destroy(resDoc.publicId).catch(err => console.error("Cloudinary delete error (Resource):", err));
      }
    }

    // 3. Find and delete Cloudinary assets for Research Papers
    const papers = await ResearchPaper.find({ project: projectId });
    for (const paper of papers) {
      if (paper.pdfPublicId) {
        await cloudinary.uploader.destroy(paper.pdfPublicId).catch(err => console.error("Cloudinary delete error (Paper):", err));
      }
    }

    // 4. Delete MongoDB records in all associated collections
    await Promise.all([
      Task.deleteMany({ project: projectId }),
      Document.deleteMany({ project: projectId }),
      Resource.deleteMany({ project: projectId }),
      ResearchPaper.deleteMany({ project: projectId }),
      Reference.deleteMany({ project: projectId }),
      Milestone.deleteMany({ project: projectId }),
      Activity.deleteMany({ project: projectId }),
      Message.deleteMany({ project: projectId }),
      Notification.deleteMany({ project: projectId }),
      Invitation.deleteMany({ project: projectId }),
    ]);

    // 5. Finally, delete the project itself
    await project.deleteOne();
    
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
