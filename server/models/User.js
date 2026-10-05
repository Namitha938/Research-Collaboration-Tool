const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      minlength: 6,
      select: false,
      required: function () {
        // Password only required if not signing up via third-party like Google
        return !this.googleId;
      },
    },
    role: {
      type: String,
      enum: ["admin", "researcher"],
      default: "researcher",
    },
    // Google Authentication
    googleId: { type: String, default: null, sparse: true },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    // Profile information
    avatar: { type: String, default: "" },
    // Mirrors avatar so both field names stay in sync across the API.
    profilePicture: { type: String, default: "" },
    bio: { type: String, maxlength: 500, default: "" },
    institution: { type: String, default: "" },
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    researchInterests: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    socialLinks: {
      website: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      orcid: { type: String, default: "" },
      googleScholar: { type: String, default: "" },
    },
    // Password Reset fields
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    resetPasswordOtp: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Keep avatar and profilePicture in sync no matter which one a caller sets.
// All user writes in this codebase go through save(), so this covers them.
userSchema.pre("save", function () {
  if (this.isModified("avatar") && !this.isModified("profilePicture")) {
    this.profilePicture = this.avatar;
  } else if (this.isModified("profilePicture") && !this.isModified("avatar")) {
    this.avatar = this.profilePicture;
  }
});

userSchema.methods.matchPassword = function (entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);

