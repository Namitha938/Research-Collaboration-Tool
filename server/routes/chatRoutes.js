const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProjectMessages, editMessage, deleteMessage } = require("../controllers/chatController");

router.use(authMiddleware);

router.get("/:projectId", getProjectMessages);
router.patch("/messages/:messageId", editMessage);
router.delete("/messages/:messageId", deleteMessage);

module.exports = router;
