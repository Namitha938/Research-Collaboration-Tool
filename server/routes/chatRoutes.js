const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProjectMessages } = require("../controllers/chatController");

router.use(authMiddleware);

router.get("/:projectId", getProjectMessages);

module.exports = router;

