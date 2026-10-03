const ResearchPaper = require("../models/ResearchPaper");
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

const createResearchPaper = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, authors, abstract, publicationYear, journal, conference, doi, url, tags, notes } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (!role || (role !== "owner" && role !== "researcher")) {
      return res.status(403).json({ success: false, message: "Only the project owner or researchers can add research papers" });
    }

    let parsedAuthors = [];
    if (authors) {
      try {
        parsedAuthors = JSON.parse(authors);
      } catch(e) {
        if (Array.isArray(authors)) parsedAuthors = authors;
        else if (typeof authors === 'string') parsedAuthors = authors.split(',').map(a => a.trim());
      }
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

    let validUrl = url;
    if (url && !/^https?:\/\//i.test(validUrl)) {
      return res.status(400).json({ success: false, message: "Invalid URL. Must be http or https." });
    }

    let newPaperData = {
      title,
      authors: parsedAuthors,
      abstract,
      publicationYear: publicationYear ? parseInt(publicationYear) : undefined,
      journal,
      conference,
      doi,
      url: validUrl,
      tags: parsedTags,
      notes,
      project: projectId,
      addedBy: req.user._id,
    };

    if (req.file) {
      let cloudResult;
      try {
        cloudResult = await uploadStream(req.file.buffer, `researchhub/papers/${projectId}`);
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ success: false, message: "File upload failed" });
      }

      newPaperData.pdfUrl = cloudResult.secure_url;
      newPaperData.pdfPublicId = cloudResult.public_id;
      newPaperData.pdfFileType = req.file.mimetype;
      newPaperData.pdfFileSize = req.file.size;
    }

    const paper = new ResearchPaper(newPaperData);

    try {
      await paper.save();
    } catch (dbErr) {
      console.error("Database save failed:", dbErr);
      if (newPaperData.pdfPublicId) {
        await cloudinary.uploader.destroy(newPaperData.pdfPublicId);
      }
      return res.status(500).json({ success: false, message: "Database save failed" });
    }

    const populatedPaper = await ResearchPaper.findById(paper._id).populate("addedBy", "name email");

    res.status(201).json({ success: true, message: "Research paper added successfully", paper: populatedPaper });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProjectResearchPapers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { project, role } = await checkProjectMembership(projectId, req.user._id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (!role) return res.status(403).json({ success: false, message: "Not authorized to view research papers in this project" });

    const papers = await ResearchPaper.find({ project: projectId })
      .populate("addedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, papers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getResearchPaperById = async (req, res) => {
  try {
    const paper = await ResearchPaper.findById(req.params.paperId).populate("addedBy", "name email");
    if (!paper) return res.status(404).json({ success: false, message: "Research paper not found" });

    const { project, role } = await checkProjectMembership(paper.project, req.user._id);
    if (!project || !role) {
      return res.status(403).json({ success: false, message: "Not authorized to view this research paper" });
    }

    res.json({ success: true, paper });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateResearchPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { title, authors, abstract, publicationYear, journal, conference, doi, url, tags, notes } = req.body;

    const paper = await ResearchPaper.findById(paperId);
    if (!paper) return res.status(404).json({ success: false, message: "Research paper not found" });

    const { project, role } = await checkProjectMembership(paper.project, req.user._id);
    if (!project || !role) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this research paper" });
    }

    const isCreator = paper.addedBy.toString() === req.user._id.toString();
    if (role !== "owner" && (!isCreator || role !== "researcher")) {
      return res.status(403).json({ success: false, message: "Only the project owner or the researcher who added it can edit this research paper" });
    }

    let parsedAuthors = paper.authors;
    if (authors) {
      try {
        parsedAuthors = JSON.parse(authors);
      } catch(e) {
        if (Array.isArray(authors)) parsedAuthors = authors;
        else if (typeof authors === 'string') parsedAuthors = authors.split(',').map(a => a.trim());
      }
    }

    let parsedTags = paper.tags;
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch(e) {
        if (Array.isArray(tags)) parsedTags = tags;
        else if (typeof tags === 'string') parsedTags = tags.split(',').map(t => t.trim());
      }
    }

    let validUrl = url !== undefined ? url : paper.url;
    if (validUrl && !/^https?:\/\//i.test(validUrl)) {
      return res.status(400).json({ success: false, message: "Invalid URL. Must be http or https." });
    }

    paper.title = title || paper.title;
    paper.authors = parsedAuthors;
    if (abstract !== undefined) paper.abstract = abstract;
    if (publicationYear !== undefined) paper.publicationYear = publicationYear ? parseInt(publicationYear) : undefined;
    if (journal !== undefined) paper.journal = journal;
    if (conference !== undefined) paper.conference = conference;
    if (doi !== undefined) paper.doi = doi;
    paper.url = validUrl;
    paper.tags = parsedTags;
    if (notes !== undefined) paper.notes = notes;

    // Optional PDF replacement
    if (req.file) {
      let cloudResult;
      try {
        cloudResult = await uploadStream(req.file.buffer, `researchhub/papers/${project._id}`);
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ success: false, message: "File upload failed" });
      }

      if (paper.pdfPublicId) {
        try {
          await cloudinary.uploader.destroy(paper.pdfPublicId);
        } catch(e) {
          console.error("Failed to destroy old PDF:", e);
        }
      }

      paper.pdfUrl = cloudResult.secure_url;
      paper.pdfPublicId = cloudResult.public_id;
      paper.pdfFileType = req.file.mimetype;
      paper.pdfFileSize = req.file.size;
    }

    await paper.save();
    
    const populatedPaper = await ResearchPaper.findById(paper._id).populate("addedBy", "name email");

    res.json({ success: true, message: "Research paper updated successfully", paper: populatedPaper });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteResearchPaper = async (req, res) => {
  try {
    const { paperId } = req.params;

    const paper = await ResearchPaper.findById(paperId);
    if (!paper) return res.status(404).json({ success: false, message: "Research paper not found" });

    const { project, role } = await checkProjectMembership(paper.project, req.user._id);
    if (!project || !role) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this research paper" });
    }

    const isCreator = paper.addedBy.toString() === req.user._id.toString();
    if (role !== "owner" && (!isCreator || role !== "researcher")) {
      return res.status(403).json({ success: false, message: "Only the project owner or the researcher who added it can delete this research paper" });
    }

    if (paper.pdfPublicId) {
      try {
        await cloudinary.uploader.destroy(paper.pdfPublicId);
      } catch(e) {
        console.error("Failed to delete PDF from Cloudinary:", e);
      }
    }

    await ResearchPaper.findByIdAndDelete(paperId);

    res.json({ success: true, message: "Research paper deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createResearchPaper,
  getProjectResearchPapers,
  getResearchPaperById,
  updateResearchPaper,
  deleteResearchPaper
};
