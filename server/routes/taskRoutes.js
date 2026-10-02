const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
} = require("../controllers/taskController");

// Mount the generic /tasks routes
// Note: Some endpoints need /projects/:projectId/tasks prefix
// We will mount this router at /api so it handles both paths gracefully

router.post("/projects/:projectId/tasks", authMiddleware, createTask);
router.get("/projects/:projectId/tasks", authMiddleware, getProjectTasks);

router.get("/tasks/:taskId", authMiddleware, getTaskById);
router.put("/tasks/:taskId", authMiddleware, updateTask);
router.patch("/tasks/:taskId/status", authMiddleware, updateTaskStatus);
router.patch("/tasks/:taskId/assign", authMiddleware, assignTask);
router.delete("/tasks/:taskId", authMiddleware, deleteTask);

module.exports = router;
