const Reference = require('../models/Reference');
const Project = require('../models/Project');
const ResearchPaper = require('../models/ResearchPaper');
const { formatCitation } = require('../utils/citationFormatter');

// Utility to verify project access
const verifyProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const isOwner = project.owner.toString() === userId.toString();
  const isMember = project.members.some(member => member.user.toString() === userId.toString());
  if (!isOwner && !isMember) return null;
  return { project, isOwner, isMember: project.members.find(m => m.user.toString() === userId.toString()) };
};

exports.createReference = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const access = await verifyProjectAccess(projectId, userId);
    if (!access) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Only owner and researcher can add references
    const role = access.isOwner ? 'owner' : access.isMember.role;
    if (role !== 'owner' && role !== 'researcher') {
      return res.status(403).json({ message: 'Only owners and researchers can add references' });
    }

    // Verify research paper if provided
    let researchPaperId = null;
    if (req.body.researchPaper) {
      const paper = await ResearchPaper.findOne({ _id: req.body.researchPaper, project: projectId });
      if (!paper) {
        return res.status(400).json({ message: 'Research paper not found in this project' });
      }
      researchPaperId = paper._id;
    }

    const {
      title,
      authors,
      publicationYear,
      journal,
      conference,
      doi,
      url,
      publisher,
      volume,
      issue,
      pages,
      citationStyle,
      citationText,
      notes
    } = req.body;

    const authorsArray = typeof authors === 'string' ? authors.split(',').map(a => a.trim()).filter(Boolean) : authors;

    // Generate citation if not manually provided
    let finalCitationText = citationText;
    if (!finalCitationText || finalCitationText.trim() === '') {
      finalCitationText = formatCitation({
        title,
        authors: authorsArray,
        publicationYear,
        journal,
        conference,
        publisher,
        citationStyle
      });
    }

    const reference = new Reference({
      title,
      authors: authorsArray,
      publicationYear,
      journal,
      conference,
      doi,
      url,
      publisher,
      volume,
      issue,
      pages,
      citationStyle: citationStyle || 'APA',
      citationText: finalCitationText,
      notes,
      project: projectId,
      researchPaper: researchPaperId,
      addedBy: userId
    });

    await reference.save();
    
    // Populate researchPaper info for UI
    if (reference.researchPaper) {
      await reference.populate('researchPaper', 'title');
    }
    await reference.populate('addedBy', 'name email');

    res.status(201).json({ success: true, reference });
  } catch (error) {
    console.error('Error creating reference:', error);
    res.status(500).json({ message: 'Failed to create reference' });
  }
};

exports.getReferences = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const access = await verifyProjectAccess(projectId, userId);
    if (!access) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    const { search, citationStyle, publicationYear, researchPaper } = req.query;

    const query = { project: projectId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } },
        { journal: { $regex: search, $options: 'i' } },
        { conference: { $regex: search, $options: 'i' } },
        { doi: { $regex: search, $options: 'i' } },
        { publisher: { $regex: search, $options: 'i' } }
      ];
    }

    if (citationStyle && citationStyle !== 'All') {
      query.citationStyle = citationStyle;
    }

    if (publicationYear && publicationYear !== 'All') {
      query.publicationYear = publicationYear;
    }

    if (researchPaper && researchPaper !== 'All') {
      if (researchPaper === 'none') {
        query.researchPaper = null;
      } else {
        query.researchPaper = researchPaper;
      }
    }

    const references = await Reference.find(query)
      .populate('addedBy', 'name email')
      .populate('researchPaper', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, references });
  } catch (error) {
    console.error('Error fetching references:', error);
    res.status(500).json({ message: 'Failed to fetch references' });
  }
};

exports.getReference = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const userId = req.user._id;

    const reference = await Reference.findById(referenceId)
      .populate('addedBy', 'name email')
      .populate('researchPaper', 'title');

    if (!reference) {
      return res.status(404).json({ message: 'Reference not found' });
    }

    const access = await verifyProjectAccess(reference.project, userId);
    if (!access) {
      return res.status(403).json({ message: 'Not authorized to view this reference' });
    }

    res.status(200).json({ success: true, reference });
  } catch (error) {
    console.error('Error fetching reference:', error);
    res.status(500).json({ message: 'Failed to fetch reference' });
  }
};

exports.updateReference = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const userId = req.user._id;

    const reference = await Reference.findById(referenceId);
    if (!reference) {
      return res.status(404).json({ message: 'Reference not found' });
    }

    const access = await verifyProjectAccess(reference.project, userId);
    if (!access) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const role = access.isOwner ? 'owner' : access.isMember.role;
    if (role === 'viewer') {
      return res.status(403).json({ message: 'Viewers cannot edit references' });
    }
    if (role === 'researcher' && reference.addedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Researchers can only edit their own references' });
    }

    // Verify research paper if updating it
    let researchPaperId = reference.researchPaper;
    if (req.body.researchPaper !== undefined) {
      if (req.body.researchPaper) {
        const paper = await ResearchPaper.findOne({ _id: req.body.researchPaper, project: reference.project });
        if (!paper) {
          return res.status(400).json({ message: 'Research paper not found in this project' });
        }
        researchPaperId = paper._id;
      } else {
        researchPaperId = null;
      }
    }

    const {
      title,
      authors,
      publicationYear,
      journal,
      conference,
      doi,
      url,
      publisher,
      volume,
      issue,
      pages,
      citationStyle,
      citationText,
      notes
    } = req.body;

    const authorsArray = typeof authors === 'string' ? authors.split(',').map(a => a.trim()).filter(Boolean) : authors || reference.authors;

    // Generate new citation if necessary
    let finalCitationText = citationText !== undefined ? citationText : reference.citationText;
    
    // Only auto-generate if fields that affect citation change, and user didn't explicitly provide new citationText
    // We'll just generate a new one based on the incoming/merged fields.
    if (citationText === undefined || citationText === null) {
       finalCitationText = formatCitation({
        title: title || reference.title,
        authors: authorsArray,
        publicationYear: publicationYear !== undefined ? publicationYear : reference.publicationYear,
        journal: journal !== undefined ? journal : reference.journal,
        conference: conference !== undefined ? conference : reference.conference,
        publisher: publisher !== undefined ? publisher : reference.publisher,
        citationStyle: citationStyle || reference.citationStyle
      });
    }

    const updateData = {
      title: title || reference.title,
      authors: authorsArray,
      publicationYear: publicationYear !== undefined ? publicationYear : reference.publicationYear,
      journal: journal !== undefined ? journal : reference.journal,
      conference: conference !== undefined ? conference : reference.conference,
      doi: doi !== undefined ? doi : reference.doi,
      url: url !== undefined ? url : reference.url,
      publisher: publisher !== undefined ? publisher : reference.publisher,
      volume: volume !== undefined ? volume : reference.volume,
      issue: issue !== undefined ? issue : reference.issue,
      pages: pages !== undefined ? pages : reference.pages,
      citationStyle: citationStyle || reference.citationStyle,
      citationText: finalCitationText,
      notes: notes !== undefined ? notes : reference.notes,
      researchPaper: researchPaperId
    };

    const updatedReference = await Reference.findByIdAndUpdate(referenceId, updateData, { new: true })
      .populate('addedBy', 'name email')
      .populate('researchPaper', 'title');

    res.status(200).json({ success: true, reference: updatedReference });
  } catch (error) {
    console.error('Error updating reference:', error);
    res.status(500).json({ message: 'Failed to update reference' });
  }
};

exports.deleteReference = async (req, res) => {
  try {
    const { referenceId } = req.params;
    const userId = req.user._id;

    const reference = await Reference.findById(referenceId);
    if (!reference) {
      return res.status(404).json({ message: 'Reference not found' });
    }

    const access = await verifyProjectAccess(reference.project, userId);
    if (!access) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const role = access.isOwner ? 'owner' : access.isMember.role;
    if (role === 'viewer') {
      return res.status(403).json({ message: 'Viewers cannot delete references' });
    }
    if (role === 'researcher' && reference.addedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Researchers can only delete their own references' });
    }

    await Reference.findByIdAndDelete(referenceId);

    res.status(200).json({ success: true, message: 'Reference deleted' });
  } catch (error) {
    console.error('Error deleting reference:', error);
    res.status(500).json({ message: 'Failed to delete reference' });
  }
};
