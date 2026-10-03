require('dotenv').config();
const mongoose = require('mongoose');
const Milestone = require('./models/Milestone');
const Project = require('./models/Project');
const User = require('./models/User');

const run = async () => {
  try {
    const dns = require("dns");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const owner = await User.findOne({ email: 'test@example.com' }) || await User.findOne();
    if (!owner) throw new Error('No users found');

    let project = await Project.findOne({ owner: owner._id });
    if (!project) {
      project = await Project.create({
        title: 'Milestone Test Project',
        description: 'Test project for milestones',
        owner: owner._id,
        researchArea: 'Computer Science'
      });
    }

    console.log('Using project:', project.title);

    // Create a milestone
    const m1 = await Milestone.create({
      title: 'Phase 1: Research',
      description: 'Initial research phase',
      project: project._id,
      createdBy: owner._id,
      assignedTo: owner._id,
      status: 'not_started',
      progress: 0,
      dueDate: new Date(Date.now() + 86400000)
    });

    console.log('Created Milestone:', m1.title);

    // Update progress and status
    m1.progress = 50;
    m1.status = 'in_progress';
    await m1.save();
    console.log('Updated Milestone:', m1.status, m1.progress + '%');

    // Delete milestone
    await m1.deleteOne();
    console.log('Deleted Milestone successfully');

    console.log('ALL TESTS PASSED');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
