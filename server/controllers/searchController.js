const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Global search for projects and tasks
// @route   GET /api/search?q=...
// @access  Private
const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.json({ success: true, projects: [], tasks: [] });
    }

    const regex = new RegExp(q, 'i');

    // Find all projects the user has access to
    const accessibleProjects = await Project.find({
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    });
    
    const projectIds = accessibleProjects.map(p => p._id);

    // Filter accessible projects by query
    const projects = accessibleProjects.filter(p => regex.test(p.title) || (p.description && regex.test(p.description)));

    // Find tasks in accessible projects that match query
    const tasks = await Task.find({
      project: { $in: projectIds },
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).populate('project', 'title');

    res.json({
      success: true,
      projects: projects.slice(0, 5), // Limit to 5 projects
      tasks: tasks.slice(0, 5) // Limit to 5 tasks
    });
  } catch (error) {
    console.error("Global search error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  globalSearch
};
