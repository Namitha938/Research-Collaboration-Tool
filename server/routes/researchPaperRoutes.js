const express = require('express');
const router = express.Router();
const { 
  createResearchPaper, 
  getProjectResearchPapers, 
  getResearchPaperById, 
  updateResearchPaper, 
  deleteResearchPaper 
} = require('../controllers/researchPaperController');
const protect = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max size
});

router.post('/projects/:projectId/research-papers', protect, upload.single('pdf'), createResearchPaper);
router.get('/projects/:projectId/research-papers', protect, getProjectResearchPapers);

router.route('/research-papers/:paperId')
  .get(protect, getResearchPaperById)
  .put(protect, upload.single('pdf'), updateResearchPaper)
  .delete(protect, deleteResearchPaper);

module.exports = router;
