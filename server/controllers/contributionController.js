const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Document = require("../models/Document");
const Resource = require("../models/Resource");
const ResearchPaper = require("../models/ResearchPaper");
const Reference = require("../models/Reference");
const Activity = require("../models/Activity");
const Comment = require("../models/Comment");

// @desc    Get contribution statistics for all project members
// @route   GET /api/projects/:projectId/contributions
// @access  Private
const getProjectContributions = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { period } = req.query;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Check authorization: must be owner or member
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some(
      (member) => member.user?._id?.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: "Not authorized to access this project" });
    }

    // Determine date filter
    let dateFilter = null;
    if (period && period !== "all") {
      const now = new Date();
      if (period === "7d") dateFilter = new Date(now.setDate(now.getDate() - 7));
      else if (period === "30d") dateFilter = new Date(now.setDate(now.getDate() - 30));
      else if (period === "90d") dateFilter = new Date(now.setDate(now.getDate() - 90));
    }

    const matchProject = { project: new mongoose.Types.ObjectId(projectId) };
    const matchProjectWithDate = { ...matchProject };
    if (dateFilter) {
      matchProjectWithDate.createdAt = { $gte: dateFilter };
    }

    // Parallel aggregations for efficiency
    const [
      tasksCreatedData,
      documentsUploadedData,
      resourcesAddedData,
      papersAddedData,
      referencesAddedData,
      commentsMadeData,
      milestonesCompletedData,
      tasksCompletedActivities
    ] = await Promise.all([
      Task.aggregate([
        { $match: matchProjectWithDate },
        { $group: { _id: "$createdBy", count: { $sum: 1 } } }
      ]),
      Document.aggregate([
        { $match: matchProjectWithDate },
        { $group: { _id: "$uploadedBy", count: { $sum: 1 } } }
      ]),
      Resource.aggregate([
        { $match: matchProjectWithDate },
        { $group: { _id: "$createdBy", count: { $sum: 1 } } }
      ]),
      ResearchPaper.aggregate([
        { $match: matchProjectWithDate },
        { $group: { _id: "$addedBy", count: { $sum: 1 } } }
      ]),
      Reference.aggregate([
        { $match: matchProjectWithDate },
        { $group: { _id: "$addedBy", count: { $sum: 1 } } }
      ]),
      Comment.aggregate([
        { $match: matchProjectWithDate },
        { $group: { _id: "$author", count: { $sum: 1 } } }
      ]),
      Activity.aggregate([
        { $match: { ...matchProjectWithDate, type: "MILESTONE_COMPLETED" } },
        { $group: { _id: "$actor", count: { $sum: 1 } } }
      ]),
      // For tasks completed, if there's a date filter, we use the activity timestamp
      dateFilter 
        ? Activity.find({ ...matchProjectWithDate, type: "TASK_COMPLETED" }, 'entityId actor')
        : null
    ]);

    // Format aggregate results into maps for O(1) lookup
    const toMap = (data) => {
      const map = {};
      data.forEach(item => {
        if (item._id) map[item._id.toString()] = item.count;
      });
      return map;
    };

    const maps = {
      tasksCreated: toMap(tasksCreatedData),
      documentsUploaded: toMap(documentsUploadedData),
      resourcesAdded: toMap(resourcesAddedData),
      papersAdded: toMap(papersAddedData),
      referencesAdded: toMap(referencesAddedData),
      commentsMade: toMap(commentsMadeData),
      milestonesCompleted: toMap(milestonesCompletedData),
    };

    // Calculate Tasks Completed manually since it requires checking assignedTo + status="completed"
    // To ensure accuracy with period filter, we use the tasks current status and assigning
    let tasksCompletedMap = {};
    if (dateFilter) {
      // Find tasks that were completed in this period
      const completedTaskIds = tasksCompletedActivities.map(a => a.entityId);
      const actualCompletedTasks = await Task.find({
        _id: { $in: completedTaskIds },
        project: projectId,
        status: "completed"
      });
      
      actualCompletedTasks.forEach(task => {
        if (task.assignedTo) {
          const uId = task.assignedTo.toString();
          tasksCompletedMap[uId] = (tasksCompletedMap[uId] || 0) + 1;
        }
      });
    } else {
      // No date filter, just aggregate Task where status="completed"
      const tasksCompletedData = await Task.aggregate([
        { $match: { ...matchProject, status: "completed" } },
        { $group: { _id: "$assignedTo", count: { $sum: 1 } } }
      ]);
      tasksCompletedMap = toMap(tasksCompletedData);
    }

    // Build unique members list (owner + members)
    const membersList = [];
    const addedUserIds = new Set();

    const addMember = (userObj, role) => {
      if (!userObj || !userObj._id) return;
      const uid = userObj._id.toString();
      if (!addedUserIds.has(uid)) {
        addedUserIds.add(uid);
        
        const tasksCreated = maps.tasksCreated[uid] || 0;
        const tasksCompleted = tasksCompletedMap[uid] || 0;
        const documentsUploaded = maps.documentsUploaded[uid] || 0;
        const resourcesAdded = maps.resourcesAdded[uid] || 0;
        const researchPapersAdded = maps.papersAdded[uid] || 0;
        const referencesAdded = maps.referencesAdded[uid] || 0;
        const milestonesCompleted = maps.milestonesCompleted[uid] || 0;
        const commentsMade = maps.commentsMade[uid] || 0;

        const totalContributions = 
          tasksCreated + 
          tasksCompleted + 
          documentsUploaded + 
          resourcesAdded + 
          researchPapersAdded + 
          referencesAdded + 
          milestonesCompleted + 
          commentsMade;

        membersList.push({
          user: {
            id: userObj._id,
            name: userObj.name,
            email: userObj.email,
            avatar: userObj.avatar
          },
          role,
          totalContributions,
          tasksCreated,
          tasksCompleted,
          documentsUploaded,
          resourcesAdded,
          researchPapersAdded,
          referencesAdded,
          milestonesCompleted,
          commentsMade
        });
      }
    };

    addMember(project.owner, "owner");
    project.members.forEach(m => addMember(m.user, m.role));

    res.json({
      success: true,
      project: {
        id: project._id,
        title: project.title
      },
      members: membersList.sort((a, b) => b.totalContributions - a.totalContributions)
    });

  } catch (error) {
    console.error("Error in getProjectContributions:", error);
    res.status(500).json({ success: false, message: "Server error fetching contributions" });
  }
};

module.exports = {
  getProjectContributions
};
