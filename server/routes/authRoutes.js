const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  getCurrentUser,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  getUserProfileById,
  logoutUser,
  getCollaborators,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const upload = require("../middleware/upload");

// Middleware to accept avatar/profilePicture/image/file uploaded via form-data
const uploadProfilePicture = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

// Public Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/logout", optionalAuth, logoutUser);

// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyResetToken);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/reset-password/:token", resetPassword);

// Profile & Account Management Routes (Protected)
router.get("/me", authMiddleware, getCurrentUser);
router.get("/profile", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

// Profile Picture Routes
router.post("/profile/avatar", authMiddleware, uploadProfilePicture, uploadAvatar);
router.post("/profile/picture", authMiddleware, uploadProfilePicture, uploadAvatar);
router.delete("/profile/avatar", authMiddleware, deleteAvatar);
router.delete("/profile/picture", authMiddleware, deleteAvatar);

// Directory & Public Researcher Profile (Protected)
router.get("/collaborators", authMiddleware, getCollaborators);
router.get("/profile/:id", authMiddleware, getUserProfileById);

module.exports = router;
