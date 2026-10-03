const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const {
  createResource,
  getProjectResources,
  getResourceById,
  updateResource,
  deleteResource,
  getAllResources,
} = require("../controllers/resourceController");

router.post("/projects/:projectId/resources", protect, upload.single("file"), createResource);
router.get("/projects/:projectId/resources", protect, getProjectResources);
router.get("/resources", protect, getAllResources);
router.get("/resources/:resourceId", protect, getResourceById);
router.put("/resources/:resourceId", protect, updateResource);
router.delete("/resources/:resourceId", protect, deleteResource);

module.exports = router;
