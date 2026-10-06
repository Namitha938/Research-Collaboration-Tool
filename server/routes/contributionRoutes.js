const express = require("express");
const router = express.Router();
const { getProjectContributions } = require("../controllers/contributionController");
const protect = require("../middleware/authMiddleware");

router.route("/:projectId/contributions").get(protect, getProjectContributions);

module.exports = router;
