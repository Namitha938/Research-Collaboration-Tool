const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

const {
  sendInvitation,
  getProjectInvitations,
  cancelInvitation,
  getProjectMembers,
  removeProjectMember,
  changeMemberRole
} = require("../controllers/teamController");

// All project routes are protected
router.use(protect);

router.route("/")
  .post(createProject)
  .get(getProjects);

router.route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Team & Invitation routes scoped to a project
router.route("/:projectId/invitations")
  .post(sendInvitation)
  .get(getProjectInvitations);
  
router.delete("/:projectId/invitations/:invitationId", cancelInvitation);

router.route("/:projectId/members")
  .get(getProjectMembers);

router.route("/:projectId/members/:userId")
  .delete(removeProjectMember);

router.put("/:projectId/members/:userId/role", changeMemberRole);

module.exports = router;
