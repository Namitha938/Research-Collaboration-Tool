const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const { getProjectMessages } = require('../controllers/chatController');

// The route should probably be mounted on /api/projects/:projectId/messages
// Let's configure it so that it can be mounted properly.
router.get('/', protect, getProjectMessages);

module.exports = router;
