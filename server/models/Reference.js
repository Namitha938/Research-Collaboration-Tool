const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authors: [{
    type: String,
    trim: true
  }],
  publicationYear: {
    type: Number
  },
  journal: {
    type: String,
    trim: true
  },
  conference: {
    type: String,
    trim: true
  },
  doi: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^(http:\/\/|https:\/\/)/.test(v);
      },
      message: 'URL must start with http:// or https://'
    }
  },
  publisher: {
    type: String,
    trim: true
  },
  volume: {
    type: String,
    trim: true
  },
  issue: {
    type: String,
    trim: true
  },
  pages: {
    type: String,
    trim: true
  },
  citationText: {
    type: String,
    trim: true
  },
  citationStyle: {
    type: String,
    enum: ['APA', 'MLA', 'IEEE', 'Chicago'],
    default: 'APA'
  },
  notes: {
    type: String,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  researchPaper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchPaper',
    default: null
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reference', referenceSchema);
