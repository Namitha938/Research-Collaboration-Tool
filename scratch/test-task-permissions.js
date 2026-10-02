const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const API_URL = "http://localhost:5000/api";
const MONGO_URI = "mongodb://127.0.0.1:27017/research_collab"; // check env if different

const runTests = async () => {
  console.log("Starting RBAC Tests...");

  // We will hit the API directly
  try {
    // 1. Create Users via API
    const createOrLoginUser = async (name, email, password) => {
      try {
        await axios.post(`${API_URL}/auth/register`, { name, email, password });
      } catch (e) {
        // ignore if exists
      }
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      return { user: res.data.user, token: res.data.token };
    };

    const owner = await createOrLoginUser("OwnerUser", "owner@test.com", "password123");
    const researcher = await createOrLoginUser("ResearcherUser", "researcher@test.com", "password123");
    const viewer = await createOrLoginUser("ViewerUser", "viewer@test.com", "password123");

    console.log("Users authenticated.");

    // 2. Connect to DB to manually set up project and members for speed
    await mongoose.connect(MONGO_URI);
    const Project = require("../../server/models/Project");

    let project = await Project.findOne({ title: "Test RBAC Project" });
    if (project) {
      await Project.deleteOne({ _id: project._id });
    }

    project = await Project.create({
      title: "Test RBAC Project",
      description: "Testing permissions",
      owner: owner.user._id,
      members: [
        { user: researcher.user._id, role: "researcher" },
        { user: viewer.user._id, role: "viewer" }
      ]
    });
    console.log("Project created with owner, researcher, viewer.");

    // Axios configs
    const ownerApi = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${owner.token}` } });
    const researcherApi = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${researcher.token}` } });
    const viewerApi = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${viewer.token}` } });

    // TEST A — OWNER CREATE
    console.log("\n--- TEST A: Owner Creates Task ---");
    let taskRes = await ownerApi.post(`/projects/${project._id}/tasks`, {
      title: "Owner Task",
      description: "Created by owner",
      assignedTo: null
    });
    console.log("Result:", taskRes.status === 201 ? "✅ Passed" : "❌ Failed");
    const taskId = taskRes.data.task._id;

    // TEST B — RESEARCHER CREATE
    console.log("\n--- TEST B: Researcher Creates Task ---");
    try {
      await researcherApi.post(`/projects/${project._id}/tasks`, {
        title: "Researcher Task",
        assignedTo: null
      });
      console.log("Result: ❌ Failed (Should have been 403)");
    } catch (err) {
      if (err.response?.status === 403 && err.response.data.message === "Only the project owner can create tasks") {
        console.log("Result: ✅ Passed (403 Forbidden)");
      } else {
        console.log("Result: ❌ Failed with wrong error", err.response?.status, err.response?.data);
      }
    }

    // TEST C — VIEWER CREATE
    console.log("\n--- TEST C: Viewer Creates Task ---");
    try {
      await viewerApi.post(`/projects/${project._id}/tasks`, {
        title: "Viewer Task",
        assignedTo: null
      });
      console.log("Result: ❌ Failed (Should have been 403)");
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("Result: ✅ Passed (403 Forbidden)");
      } else {
        console.log("Result: ❌ Failed with wrong error");
      }
    }

    // TEST D — OWNER ASSIGNS
    console.log("\n--- TEST D: Owner Assigns Task ---");
    taskRes = await ownerApi.patch(`/tasks/${taskId}/assign`, {
      assignedTo: researcher.user._id
    });
    console.log("Result:", taskRes.status === 200 ? "✅ Passed" : "❌ Failed");

    // TEST E — RESEARCHER STATUS
    console.log("\n--- TEST E: Researcher Updates Assigned Task Status ---");
    let statusRes = await researcherApi.patch(`/tasks/${taskId}/status`, {
      status: "in_progress"
    });
    console.log("Result (todo -> in_progress):", statusRes.status === 200 ? "✅ Passed" : "❌ Failed");
    statusRes = await researcherApi.patch(`/tasks/${taskId}/status`, {
      status: "completed"
    });
    console.log("Result (in_progress -> completed):", statusRes.status === 200 ? "✅ Passed" : "❌ Failed");

    // TEST F — RESEARCHER OTHER TASK
    console.log("\n--- TEST F: Researcher Updates Unassigned Task Status ---");
    let task2Res = await ownerApi.post(`/projects/${project._id}/tasks`, {
      title: "Unassigned Task",
      assignedTo: null
    });
    let task2Id = task2Res.data.task._id;
    try {
      await researcherApi.patch(`/tasks/${task2Id}/status`, { status: "in_progress" });
      console.log("Result: ❌ Failed (Should have been 403)");
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("Result: ✅ Passed (403 Forbidden)");
      } else {
        console.log("Result: ❌ Failed with wrong error", err.response?.status);
      }
    }

    // TEST G — RESEARCHER ASSIGN
    console.log("\n--- TEST G: Researcher Tries to Assign Task ---");
    try {
      await researcherApi.patch(`/tasks/${taskId}/assign`, { assignedTo: owner.user._id });
      console.log("Result: ❌ Failed (Should have been 403)");
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("Result: ✅ Passed (403 Forbidden)");
      } else {
        console.log("Result: ❌ Failed with wrong error", err.response?.status);
      }
    }

    // TEST H — RESEARCHER DELETE
    console.log("\n--- TEST H: Researcher Tries to Delete Task ---");
    try {
      await researcherApi.delete(`/tasks/${taskId}`);
      console.log("Result: ❌ Failed (Should have been 403)");
    } catch (err) {
      if (err.response?.status === 403) {
        console.log("Result: ✅ Passed (403 Forbidden)");
      } else {
        console.log("Result: ❌ Failed with wrong error", err.response?.status);
      }
    }

    // TEST I — OWNER DELETE
    console.log("\n--- TEST I: Owner Deletes Task ---");
    let deleteRes = await ownerApi.delete(`/tasks/${taskId}`);
    console.log("Result:", deleteRes.status === 200 ? "✅ Passed" : "❌ Failed");

  } catch (err) {
    console.error("Test execution failed:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

runTests();
