const express = require('express');
const router = express.Router();
const referenceController = require('../controllers/referenceController');
const protect = require('../middleware/authMiddleware');

// Base path in server.js should be /api (or project routes depending on how it's mounted)
// Wait, the instructions say:
// POST /api/projects/:projectId/references
// GET /api/projects/:projectId/references
// GET /api/references/:referenceId
// PUT /api/references/:referenceId
// DELETE /api/references/:referenceId

// For project nested routes:
router.post('/projects/:projectId/references', protect, referenceController.createReference);
router.get('/projects/:projectId/references', protect, referenceController.getReferences);

// For standalone reference routes:
router.get('/references/:referenceId', protect, referenceController.getReference);
router.put('/references/:referenceId', protect, referenceController.updateReference);
router.delete('/references/:referenceId', protect, referenceController.deleteReference);

module.exports = router;
