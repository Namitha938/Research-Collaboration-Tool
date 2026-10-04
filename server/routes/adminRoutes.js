const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", adminController.getDashboardStats);
router.get("/users", adminController.getUsers);
router.get("/users/:userId", adminController.getUserById);
router.get("/projects", adminController.getProjects);
router.get("/projects/:projectId", adminController.getProjectById);

module.exports = router;
