const mongoose = require('mongoose');

const researchPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Research paper title is required'],
    trim: true,
  },
  authors: [{
    type: String,
    trim: true,
  }],
  abstract: {
    type: String,
    trim: true,
  },
  publicationYear: {
    type: Number,
  },
  journal: {
    type: String,
    trim: true,
  },
  conference: {
    type: String,
    trim: true,
  },
  doi: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
    trim: true,
  },
  pdfUrl: {
    type: String,
  },
  pdfPublicId: {
    type: String,
  },
  pdfFileType: {
    type: String,
  },
  pdfFileSize: {
    type: Number,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ResearchPaper', researchPaperSchema);
