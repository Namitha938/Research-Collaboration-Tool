const Project = require("../models/Project");
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

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email");

    await createActivity({
      actor: req.user._id,
      project: project._id,
      type: 'PROJECT_UPDATED',
      entityType: 'project',
      entityId: project._id,
      message: `updated project details`
    });

    // If status changed to completed
    if (req.body.status === "completed" && project.status !== "completed") {
      notifyAdmins({
        type: "admin_project_completed",
        title: "Project Completed",
        message: `"${project.title}" has been marked as completed.`,
        project: project._id,
      }).catch((err) => console.error(err));
    }

    res.json({ success: true, project: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Check authorization: only owner can delete
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this project. Only the owner can delete." });
    }

    await project.deleteOne();
    res.json({ success: true, message: "Project removed successfully" });
  } catch (error) {
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
