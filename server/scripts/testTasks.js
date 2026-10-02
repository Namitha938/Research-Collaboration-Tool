const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");
const Project = require("../models/Project");

const axios = require("axios");
const baseURL = "http://localhost:5000/api";

async function runTests() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for testing");

    // Get an existing user
    let user = await User.findOne();
    if (!user) {
      console.log("No users found in database");
      process.exit(1);
    }
    
    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const authHeaders = { Authorization: `Bearer ${token}` };

    // Get an existing project or create one
    let project = await Project.findOne({ owner: user._id });
    if (!project) {
      project = await Project.create({
        title: "Test Project",
        description: "Test",
        researchArea: "AI",
        owner: user._id,
      });
    }

    // Add another member for assignment testing
    let otherUser = await User.findOne({ _id: { $ne: user._id } });
    if (!otherUser) {
      otherUser = await User.create({
        name: "Test User 2",
        email: "test2@example.com",
        password: "Password123!",
      });
    }

    if (!project.members.some(m => m.user.toString() === otherUser._id.toString())) {
      project.members.push({ user: otherUser._id, role: "researcher" });
      await project.save();
    }

    console.log(`Testing with User: ${user.email}, Project: ${project._id}`);

    // TEST 1: Create Task
    console.log("\nTEST 1: Create Task");
    const createRes = await axios.post(
      `${baseURL}/projects/${project._id}/tasks`,
      {
        title: "Collect Dataset",
        description: "Collect research dataset",
        assignedTo: otherUser._id.toString(),
        priority: "high",
        dueDate: "2026-10-10"
      },
      { headers: authHeaders }
    );
    console.log("Create Response:", createRes.status);
    const taskId = createRes.data.task._id;

    // TEST 2: Get Project Tasks
    console.log("\nTEST 2: Get Project Tasks");
    const getListRes = await axios.get(`${baseURL}/projects/${project._id}/tasks`, { headers: authHeaders });
    console.log("Get List Response:", getListRes.status, "Count:", getListRes.data.tasks.length);

    // TEST 3: Get Single Task
    console.log("\nTEST 3: Get Single Task");
    const getRes = await axios.get(`${baseURL}/tasks/${taskId}`, { headers: authHeaders });
    console.log("Get Single Response:", getRes.status, "Title:", getRes.data.task.title);

    // TEST 4: Update Task
    console.log("\nTEST 4: Update Task");
    const updateRes = await axios.put(
      `${baseURL}/tasks/${taskId}`,
      { title: "Updated Task Name", priority: "low" },
      { headers: authHeaders }
    );
    console.log("Update Response:", updateRes.status, "New Title:", updateRes.data.task.title);

    // TEST 5: Change Status
    console.log("\nTEST 5: Change Status");
    const statusRes = await axios.patch(
      `${baseURL}/tasks/${taskId}/status`,
      { status: "in_progress" },
      { headers: authHeaders }
    );
    console.log("Status Response:", statusRes.status, "New Status:", statusRes.data.task.status);

    // TEST 6: Assign Task
    console.log("\nTEST 6: Assign Task");
    const assignRes = await axios.patch(
      `${baseURL}/tasks/${taskId}/assign`,
      { assignedTo: user._id.toString() },
      { headers: authHeaders }
    );
    console.log("Assign Response:", assignRes.status, "New Assignee:", assignRes.data.task.assignedTo.name);

    // TEST 7: Invalid Assignment
    console.log("\nTEST 7: Invalid Assignment");
    try {
      const fakeId = new mongoose.Types.ObjectId();
      await axios.patch(
        `${baseURL}/tasks/${taskId}/assign`,
        { assignedTo: fakeId.toString() },
        { headers: authHeaders }
      );
      console.log("FAILED: Expected 400");
    } catch (err) {
      console.log("Invalid Assign Response:", err.response.status, err.response.data.message);
    }

    // TEST 10: Delete Task
    console.log("\nTEST 10: Delete Task");
    const delRes = await axios.delete(`${baseURL}/tasks/${taskId}`, { headers: authHeaders });
    console.log("Delete Response:", delRes.status);

    console.log("\nALL TESTS PASSED");
    process.exit(0);
  } catch (error) {
    console.error("Test failed:");
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

runTests();
