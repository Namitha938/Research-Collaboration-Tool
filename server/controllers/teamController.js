const crypto = require("crypto");
const Project = require("../models/Project");
const Invitation = require("../models/Invitation");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const createNotification = require("../utils/createNotification");
const { createActivity } = require("../utils/createActivity");

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// @desc    Send an invitation
// @route   POST /api/projects/:projectId/invitations
// @access  Private
const sendInvitation = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { projectId } = req.params;
    const lowerEmail = email.toLowerCase().trim();

    if (!lowerEmail || !role) {
      return res.status(400).json({ success: false, message: "Email and role are required" });
    }

    if (role !== "researcher" && role !== "viewer") {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the project owner can invite members" });
    }

    if (req.user.email === lowerEmail) {
      return res.status(400).json({ success: false, message: "You cannot invite yourself" });
    }

    // Check if already a member
    await project.populate("members.user", "email");
    const isAlreadyMember = project.members.some((m) => m.user?.email === lowerEmail);
    if (isAlreadyMember) {
      return res.status(409).json({ success: false, message: "User is already a member of this project" });
    }

    // Check if pending invitation exists
    const existingInvite = await Invitation.findOne({ project: projectId, email: lowerEmail, status: "pending" });
    if (existingInvite) {
      return res.status(409).json({ success: false, message: "A pending invitation already exists for this email" });
    }

    // Create token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    
    // Set expiration 48 hours
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const invitation = await Invitation.create({
      project: projectId,
      email: lowerEmail,
      invitedBy: req.user._id,
      role,
      tokenHash,
      expiresAt,
    });

    const inviteUrl = `${process.env.CLIENT_URL}/invitations/${rawToken}`;
    
    try {
      await sendEmail({
        to: lowerEmail,
        subject: `You're invited to collaborate on ${project.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a;">ResearchHub</h2>
            <p>You've been invited to collaborate on a research project.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Project:</strong> ${project.title}</p>
              <p style="margin: 0 0 10px 0;"><strong>Invited by:</strong> ${req.user.name}</p>
              <p style="margin: 0;"><strong>Role:</strong> ${role === 'researcher' ? 'Researcher' : 'Viewer'}</p>
            </div>
            <a href="${inviteUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">Accept Invitation</a>
            <p style="color: #64748b; font-size: 14px;">Or copy and paste this link into your browser:<br/>
            <a href="${inviteUrl}" style="color: #4f46e5;">${inviteUrl}</a></p>
          </div>
        `
      });
    } catch (error) {
      await Invitation.findByIdAndDelete(invitation._id);
      console.error("Email delivery failed, invitation rolled back.", error);
      return res.status(500).json({ success: false, message: "Failed to send email. Invitation was cancelled." });
    }

    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      await createNotification({
        recipient: existingUser._id,
        type: "project_invitation",
        title: "Project invitation",
        message: `${req.user.name} invited you to join "${project.title}".`,
        project: projectId,
        invitation: invitation._id
      });
    }

    await createActivity({
      actor: req.user._id,
      project: projectId,
      type: 'MEMBER_INVITED',
      entityType: 'user',
      entityId: existingUser ? existingUser._id : null,
      message: `invited ${lowerEmail} as ${role}`
    });

    res.status(201).json({ success: true, message: "Invitation sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get project pending invitations
// @route   GET /api/projects/:projectId/invitations
const getProjectInvitations = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const invitations = await Invitation.find({ project: req.params.projectId, status: "pending" })
      .select("-tokenHash")
      .populate("invitedBy", "name email");
      
    res.json({ success: true, invitations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Cancel invitation
// @route   DELETE /api/projects/:projectId/invitations/:invitationId
const cancelInvitation = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project || project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Invitation.findOneAndDelete({ _id: req.params.invitationId, project: req.params.projectId });
    res.json({ success: true, message: "Invitation cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get project members
// @route   GET /api/projects/:projectId/members
const getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("members.user", "_id name email");
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isMember = project.members.some((m) => m.user?._id?.toString() === req.user._id.toString());
    
    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, members: project.members });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Remove project member
// @route   DELETE /api/projects/:projectId/members/:userId
const removeProjectMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project || project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (req.user._id.toString() === req.params.userId) {
      return res.status(400).json({ success: false, message: "Cannot remove yourself as owner" });
    }

    project.members = project.members.filter((m) => m.user?.toString() !== req.params.userId);
    await project.save();

    await createNotification({
      recipient: req.params.userId,
      type: "member_removed",
      title: "Removed from project",
      message: `You were removed from "${project.title}".`,
      project: project._id
    });

    await createActivity({
      actor: req.user._id,
      project: project._id,
      type: 'MEMBER_REMOVED',
      entityType: 'user',
      entityId: req.params.userId,
      message: `removed a member from the project`
    });

    res.json({ success: true, message: "Member removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Change member role
// @route   PUT /api/projects/:projectId/members/:userId/role
const changeMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (role !== "researcher" && role !== "viewer") {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project || project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (req.params.userId === project.owner.toString()) {
      return res.status(400).json({ success: false, message: "Cannot change owner role" });
    }

    const member = project.members.find((m) => m.user?.toString() === req.params.userId);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    member.role = role;
    await project.save();

    await createNotification({
      recipient: req.params.userId,
      type: "role_changed",
      title: "Project role updated",
      message: `Your role in "${project.title}" was changed to ${role}.`,
      project: project._id
    });

    await createActivity({
      actor: req.user._id,
      project: project._id,
      type: 'MEMBER_ROLE_CHANGED',
      entityType: 'user',
      entityId: req.params.userId,
      message: `changed a member's role to ${role}`
    });

    res.json({ success: true, message: "Role updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get my invitations
// @route   GET /api/invitations
const getMyInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({ email: req.user.email, status: "pending" })
      .select("-tokenHash")
      .populate("project", "title")
      .populate("invitedBy", "name");
      
    res.json({ success: true, invitations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Accept invitation
// @route   POST /api/invitations/:token/accept
const acceptInvitation = async (req, res) => {
  try {
    const tokenHash = hashToken(req.params.token);
    const invitation = await Invitation.findOne({ tokenHash });
    
    if (!invitation) return res.status(404).json({ success: false, message: "Invitation not found" });
    if (invitation.status !== "pending") return res.status(400).json({ success: false, message: "Invitation is already " + invitation.status });
    if (new Date() > invitation.expiresAt) return res.status(410).json({ success: false, message: "Invitation expired" });
    
    if (invitation.email !== req.user.email) {
      return res.status(403).json({ success: false, message: "This invitation was sent to a different email address." });
    }

    const project = await Project.findById(invitation.project);
    if (!project) return res.status(404).json({ success: false, message: "Project no longer exists" });

    const isMember = project.members.some((m) => m.user?.toString() === req.user._id.toString());
    if (isMember) {
      invitation.status = "accepted";
      await invitation.save();
      return res.status(409).json({ success: false, message: "You are already a member of this project" });
    }

    project.members.push({ user: req.user._id, role: invitation.role, joinedAt: new Date() });
    await project.save();

    invitation.status = "accepted";
    invitation.acceptedAt = new Date();
    await invitation.save();

    await createNotification({
      recipient: project.owner,
      type: "invitation_accepted",
      title: "Invitation accepted",
      message: `${req.user.name} accepted your invitation to join "${project.title}".`,
      project: project._id,
      invitation: invitation._id
    });

    await createActivity({
      actor: req.user._id,
      project: project._id,
      type: 'MEMBER_JOINED',
      entityType: 'user',
      entityId: req.user._id,
      message: `joined the project as ${invitation.role}`
    });

    res.json({ success: true, message: "Invitation accepted", projectId: project._id, projectName: project.title });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Reject invitation
// @route   POST /api/invitations/:token/reject
const rejectInvitation = async (req, res) => {
  try {
    const tokenHash = hashToken(req.params.token);
    const invitation = await Invitation.findOne({ tokenHash });
    
    if (!invitation) return res.status(404).json({ success: false, message: "Invitation not found" });
    if (invitation.status !== "pending") return res.status(400).json({ success: false, message: "Invitation is already " + invitation.status });
    
    if (invitation.email !== req.user.email) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    invitation.status = "rejected";
    await invitation.save();

    const project = await Project.findById(invitation.project);
    if (project) {
      await createNotification({
        recipient: project.owner,
        type: "invitation_rejected",
        title: "Invitation declined",
        message: `${req.user.name} declined your invitation to join "${project.title}".`,
        project: project._id,
        invitation: invitation._id
      });
    }

    res.json({ success: true, message: "Invitation rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Also expose a way to get invitation details by token before login
const getInvitationByToken = async (req, res) => {
  try {
    const tokenHash = hashToken(req.params.token);
    const invitation = await Invitation.findOne({ tokenHash })
      .select("email status expiresAt role")
      .populate("project", "title")
      .populate("invitedBy", "name");
      
    if (!invitation) return res.status(404).json({ success: false, message: "Invitation not found" });
    
    res.json({ success: true, invitation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  sendInvitation,
  getProjectInvitations,
  cancelInvitation,
  getProjectMembers,
  removeProjectMember,
  changeMemberRole,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
  getInvitationByToken
};
