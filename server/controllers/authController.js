const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const notifyAdmins = require("../utils/notifyAdmins");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email and password" });
    }

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       return res.status(400).json({ success: false, message: "Please provide a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ success: false, message: "User already exists with this email" });
    }

    // Create user (role will default to "researcher")
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id, user.role);

      // Notify admins asynchronously
      notifyAdmins({
        type: "admin_new_user",
        title: "New Researcher Registered",
        message: `${user.name} has registered on ResearchHub.`,
      }).catch((err) => console.error(err));

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
       return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully (client should remove token)",
  });
};

// @desc    Update user profile or password
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (user) {
      if (req.body.name) {
        user.name = req.body.name;
      }

      if (req.body.newPassword && req.body.currentPassword) {
        if (await user.matchPassword(req.body.currentPassword)) {
          user.password = req.body.newPassword;
        } else {
          return res.status(401).json({ success: false, message: 'Invalid current password' });
        }
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: req.body.newPassword ? 'Password changed successfully' : 'Profile updated',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateProfile,
};
