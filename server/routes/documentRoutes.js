const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const {
  uploadDocument,
  getProjectDocuments,
  getAllDocuments,
  getDocumentById,
  getDownloadUrl,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");

router.post("/projects/:projectId/documents", protect, upload.single("document"), uploadDocument);
router.get("/projects/:projectId/documents", protect, getProjectDocuments);
router.get("/documents", protect, getAllDocuments);
router.get("/documents/:documentId", protect, getDocumentById);
router.get("/documents/:documentId/download", protect, getDownloadUrl);
router.put("/documents/:documentId", protect, updateDocument);
router.delete("/documents/:documentId", protect, deleteDocument);

module.exports = router;
