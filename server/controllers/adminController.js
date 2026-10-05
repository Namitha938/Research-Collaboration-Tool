const User = require("../models/User");
const Project = require("../models/Project");
const AuditLog = require("../models/AuditLog");
const logAudit = require("../utils/logAudit");

const AUDIT_CATEGORIES = ["auth", "profile", "project", "admin", "security"];
const MAX_EXPORT_ROWS = 5000;

// Escapes a value for safe CSV output (quotes, commas, newlines, formula injection)
const toCsvCell = (value) => {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  // Neutralize spreadsheet formula injection
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
  return `"${str.replace(/"/g, '""')}"`;
};

const buildAuditQuery = ({ search, category, action, status, from, to }) => {
  const query = {};

  if (category && AUDIT_CATEGORIES.includes(category)) {
    query.category = category;
  }
  if (action) {
    query.action = { $regex: String(action).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  }
  if (status === "success" || status === "failure") {
    query.status = status;
  }

  if (from || to) {
    query.createdAt = {};
    if (from) {
      const fromDate = new Date(from);
      // A bare YYYY-MM-DD means "start of that day"
      if (/^\d{4}-\d{2}-\d{2}$/.test(String(from))) fromDate.setUTCHours(0, 0, 0, 0);
      if (!Number.isNaN(fromDate.getTime())) query.createdAt.$gte = fromDate;
    }
    if (to) {
      const toDate = new Date(to);
      // A bare YYYY-MM-DD must include the whole day, not cut it off at midnight
      if (/^\d{4}-\d{2}-\d{2}$/.test(String(to))) toDate.setUTCHours(23, 59, 59, 999);
      if (!Number.isNaN(toDate.getTime())) query.createdAt.$lte = toDate;
    }
    if (!query.createdAt.$gte && !query.createdAt.$lte) delete query.createdAt;
  }

  if (search) {
    const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchOr = [
      { actorName: { $regex: safe, $options: "i" } },
      { actorEmail: { $regex: safe, $options: "i" } },
      { action: { $regex: safe, $options: "i" } },
      { description: { $regex: safe, $options: "i" } },
      { entityType: { $regex: safe, $options: "i" } },
    ];
    query.$or = query.$or ? query.$or.concat(searchOr) : searchOr;
  }

  return query;
};

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

// GET /api/admin/audit-log
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 25, search, category, action, status, from, to } = req.query;

    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 100);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);

    const query = buildAuditQuery({ search, category, action, status, from, to });

    const [total, logs, categoryCounts] = await Promise.all([
      AuditLog.countDocuments(query),
      AuditLog.find(query)
        .populate("actor", "name email avatar role")
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
      AuditLog.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);

    res.json({
      success: true,
      data: logs,
      counts: categoryCounts.reduce((acc, row) => {
        acc[row._id] = row.count;
        return acc;
      }, {}),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    console.error("Error in getAuditLogs:", error);
    res.status(500).json({ success: false, message: "Failed to load audit logs" });
  }
};

// GET /api/admin/audit-log/export  (CSV download)
exports.exportAuditLogs = async (req, res) => {
  try {
    const { search, category, action, status, from, to, format } = req.query;

    const query = buildAuditQuery({ search, category, action, status, from, to });

    const totalMatched = await AuditLog.countDocuments(query);

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(MAX_EXPORT_ROWS)
      .lean();

    const truncated = totalMatched > logs.length;

    logAudit({
      req,
      action: "admin.audit_log_exported",
      category: "admin",
      entityType: "auditLog",
      description: `Exported ${logs.length} of ${totalMatched} audit log entr${totalMatched === 1 ? "y" : "ies"}${truncated ? " (capped at export limit)" : ""}${category ? ` (category: ${category})` : ""}`,
      metadata: { filters: { search: search || null, category: category || null, action: action || null, status: status || null, from: from || null, to: to || null }, rows: logs.length, totalMatched, truncated },
    }).catch(() => {});

    const headers = [
      "Timestamp",
      "Actor Name",
      "Actor Email",
      "Actor Role",
      "Action",
      "Category",
      "Status",
      "Entity Type",
      "Entity ID",
      "Description",
      "IP Address",
      "User Agent",
    ];

    const rows = logs.map((log) => [
      new Date(log.createdAt).toISOString(),
      log.actorName,
      log.actorEmail,
      log.actorRole,
      log.action,
      log.category,
      log.status,
      log.entityType,
      log.entityId,
      log.description,
      log.ipAddress,
      log.userAgent,
    ]);

    let body;

    if (format === "json") {
      body = JSON.stringify(
        { exportedAt: new Date().toISOString(), total: logs.length, totalMatched, truncated, data: logs },
        null,
        2
      );
    } else {
      body = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n");
    }

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const extension = format === "json" ? "json" : "csv";
    const filename = `researchhub-audit-log-${stamp}.${extension}`;

    res.setHeader("Content-Type", format === "json" ? "application/json; charset=utf-8" : "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("X-Total-Rows", String(logs.length));
    res.setHeader("X-Total-Matched", String(totalMatched));
    res.setHeader("X-Truncated", String(truncated));
    res.send(body);
  } catch (error) {
    console.error("Error in exportAuditLogs:", error);
    res.status(500).json({ success: false, message: "Failed to export audit logs" });
  }
};
