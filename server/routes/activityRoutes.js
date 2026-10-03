const express = require('express');
const router = express.Router({ mergeParams: true });
const { getProjectActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProjectActivities);

module.exports = router;
