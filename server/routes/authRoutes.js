const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/me
// @access  Private
router.get("/me", authMiddleware, getCurrentUser);

// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", authMiddleware, getCurrentUser);

// @route   PUT /api/auth/profile
// @access  Private
router.put("/profile", authMiddleware, updateProfile);

// @route   POST /api/auth/logout
// @access  Public
router.post("/logout", logoutUser);

module.exports = router;
