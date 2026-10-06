const express = require('express');
const router = express.Router();
const {
  getComments,
  addComment,
  editComment,
  deleteComment
} = require('../controllers/commentController');
const protect = require('../middleware/authMiddleware');

// Project-level document comments
router.route('/projects/:projectId/documents/:documentId/comments')
  .get(protect, getComments)
  .post(protect, addComment);

// Comment-level routes for edit/delete
router.route('/comments/:commentId')
  .put(protect, editComment)
  .delete(protect, deleteComment);

module.exports = router;
