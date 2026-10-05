import React, { useState, useEffect, useRef } from "react";
import { User, Lock, Camera, Trash2, Globe, Link2, Share2, BookOpen, GraduationCap, MapPin, Phone, Building, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, updateUserData } = useAuth();
  const fileInputRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    institution: "",
    department: "",
    designation: "",
    phone: "",
    location: "",
    researchInterests: "",
    skills: "",
    website: "",
    github: "",
    linkedin: "",
    googleScholar: "",
    orcid: "",
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        institution: user.institution || "",
        department: user.department || "",
        designation: user.designation || "",
        phone: user.phone || "",
        location: user.location || "",
        researchInterests: Array.isArray(user.researchInterests)
          ? user.researchInterests.join(", ")
          : (user.researchInterests || ""),
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : (user.skills || ""),
        website: user.socialLinks?.website || "",
        github: user.socialLinks?.github || "",
        linkedin: user.socialLinks?.linkedin || "",
        googleScholar: user.socialLinks?.googleScholar || "",
        orcid: user.socialLinks?.orcid || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Profile Picture Upload Handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("avatar", file);

    setUploadingPhoto(true);
    try {
      const res = await api.post("/auth/profile/avatar", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Profile picture updated!");
        const newPhoto = res.data.profilePicture || res.data.avatar;
        updateUserData({
          profilePicture: newPhoto,
          avatar: newPhoto,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove Profile Picture Handler
  const handleRemovePhoto = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;

    setRemovingPhoto(true);
    try {
      const res = await api.delete("/auth/profile/picture");
      if (res.data.success) {
        toast.success("Profile picture removed");
        updateUserData({
          profilePicture: "",
          avatar: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove profile picture");
    } finally {
      setRemovingPhoto(false);
    }
  };

  // Save Profile Handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        name: formData.name.trim(),
        bio: formData.bio,
        institution: formData.institution,
        department: formData.department,
        designation: formData.designation,
        phone: formData.phone,
        location: formData.location,
        researchInterests: formData.researchInterests
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        socialLinks: {
          website: formData.website,
          github: formData.github,
          linkedin: formData.linkedin,
          googleScholar: formData.googleScholar,
          orcid: formData.orcid,
        },
      };

      const res = await api.put("/auth/profile", payload);
      toast.success(res.data.message || "Profile updated successfully");
      if (res.data.user) {
        updateUserData(res.data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setChangingPass(true);
    try {
      const res = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPass(false);
    }
  };

  const photo = user?.profilePicture || user?.avatar;

  return (
    <div className="mx-auto max-w-4xl animate-fade-in space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account & Profile Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your research identity, affiliations, photo, and security credentials.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Picture Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
              <Camera size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Profile Picture</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload a professional photo for your research profile</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              {photo ? (
                <img
                  src={photo}
                  alt={user?.name || "Researcher"}
                  className="h-28 w-28 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-md">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg border-2 border-white dark:border-slate-900 transition-transform active:scale-95 disabled:opacity-50"
                title="Change Photo"
              >
                <Camera size={16} />
              </button>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
                >
                  {uploadingPhoto ? "Uploading..." : "Upload New Photo"}
                </button>

                {photo && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={removingPhoto}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                  >
                    <Trash2 size={14} />
                    {removingPhoto ? "Removing..." : "Remove"}
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recommended: Square image (JPEG, PNG or WEBP), max 5MB. Face centered for automatic cropping.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Profile & Academic Information</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage your researcher profile details</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Dr. Alan Turing"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  <span className="inline-flex items-center gap-1.5"><Building size={14} /> Institution / University</span>
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="e.g. Stanford University"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  <span className="inline-flex items-center gap-1.5"><Briefcase size={14} /> Department / Faculty</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science & AI"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Academic Designation / Title</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g. Associate Professor / Research Fellow"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Palo Alto, CA, USA"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  <span className="inline-flex items-center gap-1.5"><Phone size={14} /> Contact Phone</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Platform Role</label>
                <div className="py-2">
                  <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
                    {user?.role || "Researcher"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">About / Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Brief summary of your academic background and current research..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Research Interests (comma-separated)
              </label>
              <input
                type="text"
                name="researchInterests"
                value={formData.researchInterests}
                onChange={handleInputChange}
                placeholder="e.g. Deep Learning, Quantum Computing, Genomics"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Skills & Methodologies (comma-separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g. PyTorch, CRISPR, Clinical Trials, Data Visualization"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            {/* Social & Academic Links */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Academic & Social Profiles
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span className="inline-flex items-center gap-1.5"><Globe size={14} /> Website / Portfolio</span>
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span className="inline-flex items-center gap-1.5"><GraduationCap size={14} /> Google Scholar URL</span>
                  </label>
                  <input
                    type="url"
                    name="googleScholar"
                    value={formData.googleScholar}
                    onChange={handleInputChange}
                    placeholder="https://scholar.google.com/..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span className="inline-flex items-center gap-1.5"><BookOpen size={14} /> ORCID Profile URL</span>
                  </label>
                  <input
                    type="url"
                    name="orcid"
                    value={formData.orcid}
                    onChange={handleInputChange}
                    placeholder="https://orcid.org/0000-..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span className="inline-flex items-center gap-1.5"><Link2 size={14} /> GitHub Profile URL</span>
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span className="inline-flex items-center gap-1.5"><Share2 size={14} /> LinkedIn Profile URL</span>
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
              >
                {savingProfile ? "Saving Profile..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Security & Password</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ensure your account uses a strong, unique password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="mt-6 space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPass}
                className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-60 transition-colors"
              >
                {changingPass ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
