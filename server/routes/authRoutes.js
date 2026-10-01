const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
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

// @route   POST /api/auth/logout
// @access  Public
router.post("/logout", logoutUser);

module.exports = router;
