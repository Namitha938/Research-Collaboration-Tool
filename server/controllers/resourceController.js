const Resource = require("../models/Resource");
const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");

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

const createResource = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, type, url, tags } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: "Name and type are required" });
    }

    const validTypes = ["link", "dataset", "repository", "file", "reference"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid resource type" });
    }

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Restrict creation to owner and researcher
    if (!role || (role !== "owner" && role !== "researcher")) {
      return res.status(403).json({ success: false, message: "Only the project owner or researchers can add resources" });
    }

    let parsedTags = [];
    if (tags) {
        try {
            parsedTags = JSON.parse(tags);
        } catch(e) {
            if (Array.isArray(tags)) parsedTags = tags;
            else if (typeof tags === 'string') parsedTags = tags.split(',').map(t => t.trim());
        }
    }

    let newResourceData = {
      name,
      description,
      type,
      tags: parsedTags,
      project: projectId,
      createdBy: req.user._id,
    };

    if (type === "file") {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded for file resource" });
      }

      let cloudResult;
      try {
        cloudResult = await uploadStream(req.file.buffer, `researchhub/resources/${projectId}`);
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ success: false, message: "File upload failed" });
      }

      newResourceData.fileUrl = cloudResult.secure_url;
      newResourceData.publicId = cloudResult.public_id;
      newResourceData.fileType = req.file.mimetype;
      newResourceData.fileSize = req.file.size;
    } else {
      if (!url) {
        return res.status(400).json({ success: false, message: "URL is required for this resource type" });
      }
      
      let validUrl = url;
      if (!/^https?:\/\//i.test(validUrl)) {
        return res.status(400).json({ success: false, message: "Invalid URL. Must be http or https." });
      }

      newResourceData.url = validUrl;
    }

    const resource = new Resource(newResourceData);

    try {
      await resource.save();
    } catch (dbErr) {
      console.error("Database save failed:", dbErr);
      if (type === "file" && newResourceData.publicId) {
        await cloudinary.uploader.destroy(newResourceData.publicId);
      }
      return res.status(500).json({ success: false, message: "Database save failed" });
    }

    const populatedResource = await Resource.findById(resource._id).populate("createdBy", "name email");

    res.status(201).json({ success: true, message: "Resource created successfully", resource: populatedResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProjectResources = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (!role) return res.status(403).json({ success: false, message: "Not authorized to view resources in this project" });

    const resources = await Resource.find({ project: projectId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId).populate("createdBy", "name email");
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    const { project, role } = await checkProjectMembership(resource.project, req.user._id);
    if (!project || !role) {
      return res.status(403).json({ success: false, message: "Not authorized to view this resource" });
    }

    res.json({ success: true, resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateResource = async (req, res) => {
  try {
    const { name, description, type, url, tags } = req.body;
    
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    const { project, role } = await checkProjectMembership(resource.project, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Check permission to edit: Owner can edit anything, Researcher can edit their own
    if (role === "viewer") {
        return res.status(403).json({ success: false, message: "Viewers cannot edit resources" });
    }
    if (role === "researcher" && resource.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "You can only edit resources you created" });
    }

    if (name !== undefined) resource.name = name;
    if (description !== undefined) resource.description = description;
    
    // Changing type is allowed only if changing from url-based to url-based, not to file. 
    // Keep it simple and allow editing metadata tags and url.
    if (type !== undefined && type !== "file" && resource.type !== "file") {
        resource.type = type;
    }
    
    if (url !== undefined && resource.type !== "file") {
      let validUrl = url;
      if (!/^https?:\/\//i.test(validUrl)) {
        return res.status(400).json({ success: false, message: "Invalid URL. Must be http or https." });
      }
      resource.url = validUrl;
    }

    if (tags !== undefined) {
      let parsedTags = [];
      try {
          parsedTags = JSON.parse(tags);
      } catch(e) {
          if (Array.isArray(tags)) parsedTags = tags;
          else if (typeof tags === 'string') parsedTags = tags.split(',').map(t => t.trim());
      }
      resource.tags = parsedTags;
    }

    await resource.save();

    const populatedResource = await Resource.findById(resource._id).populate("createdBy", "name email");

    res.json({ success: true, message: "Resource updated successfully", resource: populatedResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    const { project, role } = await checkProjectMembership(resource.project, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Check permission to delete: Owner can delete anything, Researcher can delete their own
    if (role === "viewer") {
        return res.status(403).json({ success: false, message: "Viewers cannot delete resources" });
    }
    if (role === "researcher" && resource.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "You can only delete resources you created" });
    }

    // Delete from Cloudinary if file type
    if (resource.type === "file" && resource.publicId) {
      try {
        await cloudinary.uploader.destroy(resource.publicId);
      } catch (cloudErr) {
        console.error("Cloudinary delete failed:", cloudErr);
      }
    }

    await resource.deleteOne();

    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllResources = async (req, res) => {
  try {
    const { type, search } = req.query;

    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    }).select("_id");
    
    const projectIds = projects.map(p => p._id);

    let query = { project: { $in: projectIds } };

    if (type && type !== "all") {
      query.type = type;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const resources = await Resource.find(query)
      .populate("project", "title")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createResource,
  getProjectResources,
  getResourceById,
  updateResource,
  deleteResource,
  getAllResources,
};
