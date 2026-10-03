const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Activity = require('./models/Activity');
const { createActivity } = require('./utils/createActivity');

dotenv.config();

const runTest = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    // Find any user
    const user = await User.findOne({});
    if (!user) {
      console.log('No user found in DB. Test aborted.');
      process.exit(1);
    }

    // Find a project
    let project = await Project.findOne({ owner: user._id });
    if (!project) {
      project = await Project.create({
        title: 'Activity Test Project',
        description: 'Testing activity logging',
        researchArea: 'Computer Science',
        owner: user._id,
        members: [{ user: user._id, role: 'owner' }],
        status: 'active',
        progress: 0
      });
      
      await createActivity({
        actor: user._id,
        project: project._id,
        type: 'PROJECT_CREATED',
        entityType: 'project',
        entityId: project._id,
        message: `created the project "${project.title}"`
      });
      console.log('Created test project');
    }

    // Get activities
    const activities = await Activity.find({ project: project._id }).populate('actor', 'name');
    console.log(`\nFound ${activities.length} activities for project: ${project.title}`);
    
    activities.forEach(a => {
       console.log(`- [${a.type}] ${a.actor?.name || 'Unknown'}: ${a.message}`);
    });

    console.log('\nTest completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

runTest();
