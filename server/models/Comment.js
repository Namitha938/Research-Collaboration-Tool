const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: { 
      type: String, 
      required: true, 
      trim: true 
    },
    document: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Document", 
      required: true 
    },
    project: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Project", 
      required: true 
    },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    isEdited: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
