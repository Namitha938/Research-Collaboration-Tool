const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");
const createNotification = require("../utils/createNotification");

// Helper to check project membership and get role
const checkProjectMembership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, role: null };

  const isOwner = project.owner.toString() === userId.toString();
  const member = project.members.find((m) => m.user?.toString() === userId.toString());

  if (isOwner) return { project, role: "owner" };
  if (member) return { project, role: member.role };
  return { project, role: null };
};

// @desc    Create a task for a project
// @route   POST /api/projects/:projectId/tasks
// @access  Private (Owner, Researcher)
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (!role || role !== "owner") {
      return res.status(403).json({ success: false, message: "Only the project owner can create tasks" });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({ success: false, message: "Invalid priority" });
    }

    let parsedDueDate = null;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid due date" });
      }
    }

    // Verify assigned user is a member of this project
    if (assignedTo) {
      const isAssigneeOwner = project.owner.toString() === assignedTo;
      const isAssigneeMember = project.members.some((m) => m.user?.toString() === assignedTo);
      if (!isAssigneeOwner && !isAssigneeMember) {
        return res.status(400).json({ success: false, message: "Assigned user is not a member of this project." });
      }
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || "medium",
      dueDate: parsedDueDate,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await createNotification({
        recipient: assignedTo,
        type: "task_assigned",
        title: "New task assigned",
        message: `${req.user.name} assigned you the task "${title}".`,
        project: projectId,
        task: task._id
      });
    }

    res.status(201).json({ success: true, message: "Task created successfully", task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private (Owner, Researcher, Viewer)
const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (!role) return res.status(403).json({ success: false, message: "Not authorized to view tasks in this project" });

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:taskId
// @access  Private (Owner, Researcher, Viewer)
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "title owner members");

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const isOwner = task.project.owner.toString() === req.user._id.toString();
    const isMember = task.project.members.some((m) => m.user?.toString() === req.user._id.toString());

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: "Not authorized to view this task" });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update a task (full update minus status)
// @route   PUT /api/tasks/:taskId
// @access  Private (Owner, Researcher)
const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const { project, role } = await checkProjectMembership(task.project, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (!role || role !== "owner") {
      return res.status(403).json({ success: false, message: "You do not have permission to perform this action." });
    }

    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({ success: false, message: "Invalid priority" });
    }

    let parsedDueDate = task.dueDate;
    if (dueDate !== undefined) {
      if (dueDate === null) {
        parsedDueDate = null;
      } else {
        parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
          return res.status(400).json({ success: false, message: "Invalid due date" });
        }
      }
    }

    const oldAssignedTo = task.assignedTo ? task.assignedTo.toString() : null;

    if (assignedTo !== undefined && assignedTo !== task.assignedTo?.toString()) {
      if (assignedTo === null || assignedTo === "") {
        task.assignedTo = null;
      } else {
        const isAssigneeOwner = project.owner.toString() === assignedTo;
        const isAssigneeMember = project.members.some((m) => m.user?.toString() === assignedTo);
        if (!isAssigneeOwner && !isAssigneeMember) {
          return res.status(400).json({ success: false, message: "Assigned user is not a member of this project." });
        }
        task.assignedTo = assignedTo;
      }
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    task.dueDate = parsedDueDate;

    await task.save();

    if (assignedTo && assignedTo !== oldAssignedTo && assignedTo !== req.user._id.toString()) {
      await createNotification({
        recipient: assignedTo,
        type: oldAssignedTo ? "task_reassigned" : "task_assigned",
        title: oldAssignedTo ? "Task assigned to you" : "New task assigned",
        message: `${req.user.name} assigned you the task "${task.title}".`,
        project: task.project,
        task: task._id
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({ success: true, message: "Task updated successfully", task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update task status only
// @route   PATCH /api/tasks/:taskId/status
// @access  Private (Owner, Researcher)
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !["todo", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // ONLY the assigned member can update progress
    if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Task progress can only be updated by the assigned member." });
    }

    const current = task.status;
    const requested = status;

    if (current === "todo" && requested === "in_progress") {
      // ALLOW
    } else if (current === "in_progress" && requested === "completed") {
      // ALLOW
    } else {
      return res.status(400).json({ success: false, message: "Invalid task status transition" });
    }

    task.status = status;
    await task.save();

    if (status === "completed" && current !== "completed") {
      const taskProject = await Project.findById(task.project);
      if (taskProject && taskProject.owner.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: taskProject.owner,
          type: "task_completed",
          title: "Task completed",
          message: `${req.user.name} completed the task "${task.title}".`,
          project: task.project,
          task: task._id
        });
      }
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({ success: true, message: "Task status updated", task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Assign task to someone else
// @route   PATCH /api/tasks/:taskId/assign
// @access  Private (Owner, Researcher)
const assignTask = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    if (assignedTo === undefined) return res.status(400).json({ success: false, message: "assignedTo is required (can be null)" });

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const { project, role } = await checkProjectMembership(task.project, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (!role || role !== "owner") {
      return res.status(403).json({ success: false, message: "You do not have permission to perform this action." });
    }

    const oldAssignedTo = task.assignedTo ? task.assignedTo.toString() : null;

    if (assignedTo === null || assignedTo === "") {
      task.assignedTo = null;
    } else {
      const isAssigneeOwner = project.owner.toString() === assignedTo;
      const isAssigneeMember = project.members.some((m) => m.user?.toString() === assignedTo);
      if (!isAssigneeOwner && !isAssigneeMember) {
        return res.status(400).json({ success: false, message: "Assigned user is not a member of this project." });
      }
      task.assignedTo = assignedTo;
    }
    await task.save();

    if (assignedTo && assignedTo !== oldAssignedTo && assignedTo !== req.user._id.toString()) {
      await createNotification({
        recipient: assignedTo,
        type: oldAssignedTo ? "task_reassigned" : "task_assigned",
        title: oldAssignedTo ? "Task assigned to you" : "New task assigned",
        message: `${req.user.name} assigned you the task "${task.title}".`,
        project: task.project,
        task: task._id
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({ success: true, message: "Task assigned", task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
// @access  Private (Owner, Researcher)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const { role } = await checkProjectMembership(task.project, req.user._id);
    if (!role || role !== "owner") {
      return res.status(403).json({ success: false, message: "You do not have permission to perform this action." });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
};
