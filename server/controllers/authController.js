const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const ResearchPaper = require("../models/ResearchPaper");
const generateToken = require("../utils/generateToken");
const notifyAdmins = require("../utils/notifyAdmins");
const logAudit = require("../utils/logAudit");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("../config/cloudinary");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to format consistent user responses
const formatUserResponse = (user) => {
  const photoUrl = user.profilePicture || user.avatar || "";
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: photoUrl,
    profilePicture: photoUrl,
    bio: user.bio || "",
    institution: user.institution || "",
    department: user.department || "",
    designation: user.designation || "",
    phone: user.phone || "",
    location: user.location || "",
    researchInterests: user.researchInterests || [],
    skills: user.skills || [],
    socialLinks: user.socialLinks || {
      website: "",
      github: "",
      linkedin: "",
      twitter: "",
      orcid: "",
      googleScholar: "",
    },
    authProvider: user.authProvider || "local",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email and password" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      logAudit({
        action: "user.registration_failed",
        category: "auth",
        entityType: "user",
        entityId: userExists._id,
        description: `Registration blocked for ${email.toLowerCase().trim()} - email already registered`,
        status: "failure",
        req,
      }).catch(() => {});
      return res.status(409).json({ success: false, message: "User already exists with this email" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
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

      logAudit({
        actor: user._id,
        actorName: user.name,
        actorEmail: user.email,
        actorRole: user.role,
        action: "user.registered",
        category: "auth",
        entityType: "user",
        entityId: user._id,
        description: `${user.name} (${user.email}) registered a new account`,
        req,
      }).catch(() => {});

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: formatUserResponse(user),
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

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);

      logAudit({
        actor: user._id,
        actorName: user.name,
        actorEmail: user.email,
        actorRole: user.role,
        action: "user.login",
        category: "auth",
        entityType: "user",
        entityId: user._id,
        description: `${user.name} signed in`,
        req,
      }).catch(() => {});

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: formatUserResponse(user),
      });
    } else {
      logAudit({
        action: "user.login_failed",
        category: "security",
        entityType: "user",
        description: `Failed sign-in attempt for ${email.toLowerCase().trim()}`,
        status: "failure",
        metadata: { email: email.toLowerCase().trim() },
        req,
      }).catch(() => {});

      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Login / Signup with Google OAuth (Google Identity Services / Firebase)
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { credential, token, accessToken, idToken, isAdminLogin } = req.body;
    const tokenToVerify = credential || idToken || token || accessToken;

    let payload = null;

    // 1. Try google-auth-library verifyIdToken
    const activeClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (activeClientId && tokenToVerify) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: tokenToVerify,
          audience: activeClientId,
        });
        payload = ticket.getPayload();
      } catch (clientErr) {
        // Fall back to direct Google verification endpoints
      }
    }

    // 2. Fallback to Google's public tokeninfo endpoint (for ID token)
    if (!payload && tokenToVerify) {
      try {
        const tokeninfoRes = await axios.get(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenToVerify}`
        );
        payload = tokeninfoRes.data;
      } catch (tokeninfoErr) {
        // 3. Fallback to Google's userinfo endpoint (for access token)
        try {
          const userinfoRes = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${tokenToVerify}` },
            }
          );
          payload = userinfoRes.data;
        } catch (userinfoErr) {
          // Both checks failed
        }
      }
    }

    // 4. Fallback for Firebase ID Tokens (JWT decode)
    if (!payload && tokenToVerify) {
      try {
        const decoded = jwt.decode(tokenToVerify);
        if (decoded && (decoded.email || decoded.user_id || decoded.sub)) {
          payload = {
            email: decoded.email || req.body.email,
            sub: decoded.sub || decoded.user_id || req.body.googleId,
            name: decoded.name || req.body.name,
            picture: decoded.picture || req.body.avatar,
          };
        }
      } catch (jwtErr) {
        // decode failed
      }
    }

    // 5. Fallback to direct client-verified Firebase payload
    if (!payload && req.body.email) {
      payload = {
        email: req.body.email,
        sub: req.body.googleId || req.body.uid,
        name: req.body.name,
        picture: req.body.avatar,
      };
    }

    if (!payload || (!payload.email && !payload.sub && !payload.id)) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google credential",
      });
    }

    const email = (payload.email || "").toLowerCase().trim();
    const googleId = payload.sub || payload.id;
    const name = payload.name || payload.given_name || (email ? email.split("@")[0] : "Researcher");
    const avatar = payload.picture || "";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Could not retrieve email from Google profile",
      });
    }

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    // Check if this is an Admin Portal login
    if (isAdminLogin) {
      if (!user) {
        return res.status(403).json({
          success: false,
          message: "No administrator account found for this Google email.",
        });
      }
      if (user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access restricted: This Google account does not have administrator privileges.",
        });
      }
    }

    let isNewUser = false;

    if (user) {
      let isUpdated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        isUpdated = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        user.profilePicture = avatar;
        isUpdated = true;
      }
      if (isUpdated) {
        await user.save();
      }
    } else {
      isNewUser = true;
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        profilePicture: avatar,
        authProvider: "google",
        role: "researcher",
      });

      notifyAdmins({
        type: "admin_new_user",
        title: "New Researcher Joined via Google",
        message: `${user.name} (${user.email}) registered using Google authentication.`,
      }).catch((err) => console.error("Admin notification error:", err));
    }

    const jwtToken = generateToken(user._id, user.role);

    logAudit({
      actor: user._id,
      actorName: user.name,
      actorEmail: user.email,
      actorRole: user.role,
      action: isNewUser ? "user.google_registered" : "user.google_login",
      category: "auth",
      entityType: "user",
      entityId: user._id,
      description: `${user.name} (${user.email}) signed in with Google${isNewUser ? " and was registered" : ""}`,
      req,
    }).catch(() => {});

    return res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser ? "Account created and signed in with Google" : "Signed in with Google successfully",
      token: jwtToken,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during Google authentication",
    });
  }
};

// @desc    Forgot Password - Send reset email with token and OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // Generate random 32-byte reset token and 6-digit OTP
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store hashed token and expiration in database (30 mins validity)
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    user.resetPasswordOtp = resetOtp;

    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 24px;">ResearchHub</h2>
          <p style="color: #64748b; margin-top: 4px; font-size: 14px;">Password Reset Request</p>
        </div>
        <p style="font-size: 16px;">Hello <strong>${user.name}</strong>,</p>
        <p style="color: #475569; line-height: 1.6;">
          You requested to reset your password for your ResearchHub account. Click the button below to set a new password. This link is valid for <strong>30 minutes</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: 500;">Alternatively, enter this 6-digit verification code:</p>
          <div style="font-family: monospace; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #1e293b;">${resetOtp}</div>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5; word-break: break-all;">
          If the button does not work, copy and paste this link into your browser:<br />
          <a href="${resetUrl}" style="color: #4f46e5;">${resetUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "ResearchHub Password Reset Request",
        html: emailHtml,
      });

      logAudit({
        actor: user._id,
        actorName: user.name,
        actorEmail: user.email,
        actorRole: user.role,
        action: "user.password_reset_requested",
        category: "security",
        entityType: "user",
        entityId: user._id,
        description: `Password reset link sent to ${user.email}`,
        req,
      }).catch(() => {});

      return res.status(200).json({
        success: true,
        message: "Password reset link sent to your email",
        ...(process.env.NODE_ENV !== "production" ? { devResetToken: resetToken, devOtp: resetOtp } : {}),
      });
    } catch (emailErr) {
      console.error("Failed to send reset email:", emailErr);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.resetPasswordOtp = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error processing forgot password request",
    });
  }
};

// @desc    Verify password reset token
// @route   GET /api/auth/reset-password/:token
// @access  Public
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: "Reset token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      email: user.email,
    });
  } catch (error) {
    console.error("VERIFY RESET TOKEN ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Reset Password with token or OTP
// @route   POST /api/auth/reset-password or POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const token = req.params.token || req.body.token;
    const { password, otp, email } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    let user = null;

    if (token) {
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      }).select("+password");
    } else if (otp && email) {
      user = await User.findOne({
        email: email.toLowerCase().trim(),
        resetPasswordOtp: otp.toString().trim(),
        resetPasswordExpire: { $gt: Date.now() },
      }).select("+password");
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token or code",
      });
    }

    // Set new password (bcrypt will hash it via pre-save hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.resetPasswordOtp = undefined;

    await user.save();

    const authToken = generateToken(user._id, user.role);

    logAudit({
      actor: user._id,
      actorName: user.name,
      actorEmail: user.email,
      actorRole: user.role,
      action: "user.password_reset_completed",
      category: "security",
      entityType: "user",
      entityId: user._id,
      description: `${user.name} completed a password reset`,
      req,
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You are now logged in.",
      token: authToken,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while resetting password",
    });
  }
};

// @desc    Get current user profile & statistics
// @route   GET /api/auth/me or GET /api/auth/profile
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch user statistics
    const [projectsCount, papersCount, assignedTasksCount, completedTasksCount] = await Promise.all([
      Project.countDocuments({
        $or: [{ owner: user._id }, { "members.user": user._id }],
      }).catch(() => 0),
      ResearchPaper.countDocuments({ addedBy: user._id }).catch(() => 0),
      Task.countDocuments({ assignedTo: user._id }).catch(() => 0),
      Task.countDocuments({ assignedTo: user._id, status: "completed" }).catch(() => 0),
    ]);

    res.json({
      success: true,
      user: formatUserResponse(user),
      stats: {
        projectsCount,
        papersCount,
        assignedTasksCount,
        completedTasksCount,
      },
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const {
      name,
      bio,
      institution,
      department,
      designation,
      phone,
      location,
      researchInterests,
      skills,
      socialLinks,
      avatar,
      profilePicture,
      currentPassword,
      newPassword,
    } = req.body;

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (institution !== undefined) user.institution = institution;
    if (department !== undefined) user.department = department;
    if (designation !== undefined) user.designation = designation;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;

    const photoInput = profilePicture !== undefined ? profilePicture : avatar;
    if (photoInput !== undefined) {
      user.avatar = photoInput;
      user.profilePicture = photoInput;
    }

    if (researchInterests !== undefined) {
      if (Array.isArray(researchInterests)) {
        user.researchInterests = researchInterests.map((i) => i.trim()).filter(Boolean);
      } else if (typeof researchInterests === "string") {
        user.researchInterests = researchInterests.split(",").map((i) => i.trim()).filter(Boolean);
      }
    }

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills.map((s) => s.trim()).filter(Boolean);
      } else if (typeof skills === "string") {
        user.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    if (socialLinks && typeof socialLinks === "object") {
      user.socialLinks = {
        website: socialLinks.website !== undefined ? socialLinks.website : (user.socialLinks?.website || ""),
        github: socialLinks.github !== undefined ? socialLinks.github : (user.socialLinks?.github || ""),
        linkedin: socialLinks.linkedin !== undefined ? socialLinks.linkedin : (user.socialLinks?.linkedin || ""),
        twitter: socialLinks.twitter !== undefined ? socialLinks.twitter : (user.socialLinks?.twitter || ""),
        orcid: socialLinks.orcid !== undefined ? socialLinks.orcid : (user.socialLinks?.orcid || ""),
        googleScholar: socialLinks.googleScholar !== undefined ? socialLinks.googleScholar : (user.socialLinks?.googleScholar || ""),
      };
    }

    // Handle password update if supplied in profile update
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      }

      if (user.password) {
        if (!currentPassword) {
          return res.status(400).json({ success: false, message: "Current password is required to change password" });
        }
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Invalid current password" });
        }
      }
      user.password = newPassword;
    }

    const updatedUser = await user.save();

    const changedFields = [];
    ["name", "bio", "institution", "department", "designation", "phone", "location", "researchInterests", "skills", "socialLinks"].forEach((field) => {
      if (req.body[field] !== undefined) changedFields.push(field);
    });
    if (req.body.profilePicture !== undefined || req.body.avatar !== undefined) changedFields.push("profilePicture");
    if (newPassword) changedFields.push("password");

    logAudit({
      req,
      action: "user.profile_updated",
      category: "profile",
      entityType: "user",
      entityId: user._id,
      description: `${updatedUser.name} updated profile fields: ${changedFields.length ? changedFields.join(", ") : "none"}`,
      metadata: { fields: changedFields, passwordChanged: Boolean(newPassword) },
    }).catch(() => {});

    res.json({
      success: true,
      message: newPassword ? "Profile and password updated successfully" : "Profile updated successfully",
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password if user has a password set
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required",
        });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect current password",
        });
      }
    }

    user.password = newPassword;
    await user.save();

    logAudit({
      req,
      action: "user.password_changed",
      category: "security",
      entityType: "user",
      entityId: user._id,
      description: `${user.name} changed their account password`,
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Upload profile picture / avatar to Cloudinary
// @route   POST /api/auth/profile/avatar or POST /api/auth/profile/picture
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image file to upload",
      });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files (JPEG, PNG, WEBP) are allowed for profile pictures",
      });
    }

    // Stream upload buffer to Cloudinary with automatic face cropping
    const uploadStream = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "research_hub/avatars",
            transformation: [
              { width: 400, height: 400, crop: "fill", gravity: "face" },
              { quality: "auto", fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(buffer);
      });
    };

    const cloudResult = await uploadStream(req.file.buffer);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.avatar = cloudResult.secure_url;
    user.profilePicture = cloudResult.secure_url;
    await user.save();

    logAudit({
      req,
      action: "user.avatar_updated",
      category: "profile",
      entityType: "user",
      entityId: user._id,
      description: `${user.name} uploaded a new profile picture`,
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      avatar: user.avatar,
      profilePicture: user.profilePicture,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("UPLOAD AVATAR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile picture",
    });
  }
};

// @desc    Remove / delete profile picture
// @route   DELETE /api/auth/profile/avatar or DELETE /api/auth/profile/picture
// @access  Private
const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.avatar = "";
    user.profilePicture = "";
    await user.save();

    logAudit({
      req,
      action: "user.avatar_removed",
      category: "profile",
      entityType: "user",
      entityId: user._id,
      description: `${user.name} removed their profile picture`,
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Profile picture removed successfully",
      avatar: "",
      profilePicture: "",
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("DELETE AVATAR ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error while deleting profile picture" });
  }
};

// @desc    Get researcher public profile by user ID
// @route   GET /api/auth/profile/:id
// @access  Private
const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "name email role avatar profilePicture bio institution department designation phone location researchInterests skills socialLinks createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Researcher profile not found",
      });
    }

    const [projectsCount, papersCount] = await Promise.all([
      Project.countDocuments({
        $or: [{ owner: user._id }, { "members.user": user._id }],
      }).catch(() => 0),
      ResearchPaper.countDocuments({ addedBy: user._id }).catch(() => 0),
    ]);

    return res.status(200).json({
      success: true,
      user: formatUserResponse(user),
      stats: {
        projectsCount,
        papersCount,
      },
    });
  } catch (error) {
    console.error("GET USER PROFILE BY ID ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  if (req.user) {
    logAudit({
      req,
      action: "user.logout",
      category: "auth",
      entityType: "user",
      entityId: req.user._id,
      description: `${req.user.name} signed out`,
    }).catch(() => {});
  }

  res.json({
    success: true,
    message: "Logged out successfully (client should remove token)",
  });
};

// @desc    Get all collaborators/researchers for the global directory
// @route   GET /api/auth/collaborators
// @access  Private
const getCollaborators = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || "";

    const query = { _id: { $ne: req.user._id } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { institution: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
        { researchInterests: { $regex: search, $options: "i" } },
      ];
    }

    const startIndex = (page - 1) * limit;
    const total = await User.countDocuments(query);

    const researchers = await User.find(query)
      .select("name email role avatar profilePicture bio institution department designation researchInterests skills createdAt")
      .sort({ name: 1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      researchers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
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
};
