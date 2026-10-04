const User = require("../models/User");
const Project = require("../models/Project");

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const researchers = await User.countDocuments({ role: "researcher" });
    const admins = await User.countDocuments({ role: "admin" });

    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: "active" });
    const completedProjects = await Project.countDocuments({ status: "completed" });
    const archivedProjects = await Project.countDocuments({ status: "archived" });

    // Recent Users
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Projects
    const recentProjects = await Project.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          researchers,
          admins,
        },
        projects: {
          total: totalProjects,
          active: activeProjects,
          completed: completedProjects,
          archived: archivedProjects,
        },
      },
      recentUsers,
      recentProjects,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ success: false, message: "Failed to load dashboard stats" });
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (role && role !== "All") {
      query.role = role.toLowerCase();
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ success: false, message: "Failed to load users" });
  }
};

// GET /api/admin/users/:userId
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const projectCount = await Project.countDocuments({ owner: user._id });
    const memberCount = await Project.countDocuments({ "members.user": user._id });

    res.json({
      success: true,
      data: { ...user.toObject(), projectCount, memberCount },
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ success: false, message: "Failed to load user" });
  }
};

// GET /api/admin/projects
exports.getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { researchArea: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (status && status !== "All") {
      query.status = status.toLowerCase();
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getProjects:", error);
    res.status(500).json({ success: false, message: "Failed to load projects" });
  }
};

// GET /api/admin/projects/:projectId
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("owner", "name email")
      .populate("members.user", "name email role");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error in getProjectById:", error);
    res.status(500).json({ success: false, message: "Failed to load project" });
  }
};
