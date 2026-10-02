const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
  getInvitationByToken
} = require("../controllers/teamController");

// Public route to get info about an invite
router.get("/:token", getInvitationByToken);

// Protected routes
router.use(protect);
router.get("/", getMyInvitations);
router.post("/:token/accept", acceptInvitation);
router.post("/:token/reject", rejectInvitation);

module.exports = router;
