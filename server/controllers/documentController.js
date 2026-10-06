const Document = require("../models/Document");
const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");
const { streamifier } = require("stream");
const { createActivity } = require("../utils/createActivity");

// Helper to check project membership
const checkProjectMembership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, role: null };

  const isOwner = project.owner.toString() === userId.toString();
  const member = project.members.find((m) => m.user?.toString() === userId.toString());

  if (isOwner) return { project, role: "owner" };
  if (member) return { project, role: member.role };
  return { project, role: null };
};

const uploadStream = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

// @desc    Upload document
// @route   POST /api/projects/:projectId/documents
// @access  Private (Owner, Researcher)
const uploadDocument = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Document name is required" });
    }

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Restrict upload to owner and researcher
    if (!role || (role !== "owner" && role !== "researcher")) {
      return res.status(403).json({ success: false, message: "Only the project owner or researchers can upload documents" });
    }

    // Upload to Cloudinary
    let cloudResult;
    try {
      cloudResult = await uploadStream(req.file.buffer, `researchhub/projects/${projectId}`);
    } catch (uploadErr) {
      console.error("Cloudinary upload failed:", uploadErr);
      return res.status(500).json({ success: false, message: "File upload failed" });
    }

    // Create MongoDB Document
    const document = new Document({
      name,
      description,
      category: category || "other",
      fileUrl: cloudResult.secure_url,
      publicId: cloudResult.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      project: projectId,
      uploadedBy: req.user._id,
    });

    try {
      await document.save();
    } catch (dbErr) {
      console.error("Database save failed, cleaning up Cloudinary file:", dbErr);
      await cloudinary.uploader.destroy(cloudResult.public_id);
      return res.status(500).json({ success: false, message: "Database save failed" });
    }

    const populatedDoc = await Document.findById(document._id).populate("uploadedBy", "name email");

    await createActivity({
      actor: req.user._id,
      project: projectId,
      type: 'DOCUMENT_UPLOADED',
      entityType: 'document',
      entityId: document._id,
      message: `uploaded document "${document.name}"`
    });

    res.status(201).json({ success: true, message: "Document uploaded successfully", document: populatedDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get project documents
// @route   GET /api/projects/:projectId/documents
// @access  Private (Owner, Researcher, Viewer)
const getProjectDocuments = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (!role) return res.status(403).json({ success: false, message: "Not authorized to view documents in this project" });

    const documents = await Document.find({ project: projectId })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all documents for the user (global repository)
// @route   GET /api/documents
// @access  Private
const getAllDocuments = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Find all projects where user is owner or member
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    }).select("_id");
    
    const projectIds = projects.map(p => p._id);

    let query = { project: { $in: projectIds } };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const documents = await Document.find(query)
      .populate("project", "title owner members")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get download URL for a document (forces download attachment)
// @route   GET /api/documents/:documentId/download
// @access  Private
const getDownloadUrl = async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId);
    
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const { project, role } = await checkProjectMembership(document.project, req.user._id);
    if (!project || !role) {
      return res.status(403).json({ success: false, message: "Not authorized to download this document" });
    }

    if (!document.publicId) {
      return res.json({ success: true, downloadUrl: document.fileUrl });
    }
    
    // Cloudinary automatically appends the correct extension based on the asset format.
    // Adding an extension with a dot (e.g. .png) in the flag causes a parsing error.
    const safeName = document.name.replace(/[^a-zA-Z0-9-_]/g, '_');
    const cloudinaryUrl = cloudinary.url(document.publicId, {
      secure: true,
      flags: `attachment:${safeName}`
    });

    res.json({ success: true, downloadUrl: cloudinaryUrl });
  } catch (error) {
    console.error("Download URL generation error:", error);
    res.status(500).json({ success: false, message: "Server error generating download URL" });
  }
};
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId).populate("uploadedBy", "name email");
    if (!document) return res.status(404).json({ success: false, message: "Document not found" });

    const { project, role } = await checkProjectMembership(document.project, req.user._id);
    if (!project || !role) {
      return res.status(403).json({ success: false, message: "Not authorized to view this document" });
    }

    res.json({ success: true, document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update document metadata
// @route   PUT /api/documents/:documentId
// @access  Private (Owner)
const updateDocument = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const document = await Document.findById(req.params.documentId);
    if (!document) return res.status(404).json({ success: false, message: "Document not found" });

    const { project, role } = await checkProjectMembership(document.project, req.user._id);
    if (!project || role !== "owner") {
      return res.status(403).json({ success: false, message: "Only the project owner can update documents" });
    }

    if (name !== undefined) document.name = name;
    if (description !== undefined) document.description = description;

    await document.save();

    const populatedDoc = await Document.findById(document._id).populate("uploadedBy", "name email");

    res.json({ success: true, message: "Document updated successfully", document: populatedDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:documentId
// @access  Private (Owner)
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId);
    if (!document) return res.status(404).json({ success: false, message: "Document not found" });

    const { project, role } = await checkProjectMembership(document.project, req.user._id);
    if (!project || role !== "owner") {
      return res.status(403).json({ success: false, message: "Only the project owner can delete documents" });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(document.publicId);
    } catch (cloudErr) {
      console.error("Cloudinary delete failed:", cloudErr);
      // We still proceed to delete the DB record even if cloudinary fails 
      // (or we could choose to abort, but usually better to let it delete from DB so user isn't stuck)
    }

    await document.deleteOne();

    await createActivity({
      actor: req.user._id,
      project: document.project,
      type: 'DOCUMENT_DELETED',
      entityType: 'document',
      entityId: document._id,
      message: `deleted document "${document.name}"`
    });

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  uploadDocument,
  getProjectDocuments,
  getAllDocuments,
  getDocumentById,
  getDownloadUrl,
  updateDocument,
  deleteDocument,
};
