const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, { timestamps: true });

// Optional: Indexing for faster query retrieval when loading history
messageSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
