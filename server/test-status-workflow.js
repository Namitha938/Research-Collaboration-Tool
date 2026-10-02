require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

const API_URL = "http://localhost:5000/api";
const MONGO_URI = process.env.MONGO_URI;

const runTests = async () => {
  console.log("Starting Status Workflow Tests...");
  let ownerApi, assigneeApi, otherApi, viewerApi;
  let project, task, taskId;

  try {
    const createOrLoginUser = async (name, email, password) => {
      try {
        await axios.post(`${API_URL}/auth/register`, { name, email, password });
      } catch (e) {
        // ignore if exists
      }
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      return { user: res.data.user, token: res.data.token };
    };

    const owner = await createOrLoginUser("StatusOwner", "statusowner@test.com", "password123");
    const assignee = await createOrLoginUser("StatusAssignee", "statusassignee@test.com", "password123");
    const otherRes = await createOrLoginUser("StatusOther", "statusother@test.com", "password123");
    const viewer = await createOrLoginUser("StatusViewer", "statusviewer@test.com", "password123");

    console.log("Users authenticated.");
    ownerApi = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${owner.token}` } });
    assigneeApi = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${assignee.token}` } });
    otherApi = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${otherRes.token}` } });
    viewerApi = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${viewer.token}` } });

    // We will hit the API to create project instead of mongoose this time.
    let projectRes = await ownerApi.post("/projects", {
      title: "Test Status Workflow Project",
      description: "Testing state machine",
      researchArea: "Computer Science"
    });
    project = projectRes.data.project;
    console.log("Project created:", project._id);

    // Setup DB bypass just to insert members quickly because the API invitation flow is email-based.
    await mongoose.connect(MONGO_URI);
    const ProjectModel = require("./models/Project");
    await ProjectModel.updateOne(
      { _id: project._id },
      { $push: { members: [
          { user: assignee.user.id, role: "researcher" },
          { user: otherRes.user.id, role: "researcher" },
          { user: viewer.user.id, role: "viewer" }
        ] } 
      }
    );
    console.log("Members injected.");

    // TEST 1 — OWNER CREATES
    console.log("\n--- TEST 1: Owner Creates Task ---");
    let taskRes = await ownerApi.post(`/projects/${project._id}/tasks`, {
      title: "Workflow Task",
      assignedTo: null
    });
    taskId = taskRes.data.task._id;
    if (taskRes.data.task.status === "todo") console.log("Result: ✅ Passed");
    else console.log("Result: ❌ Failed (Status is not todo)");

    // TEST 2 — OWNER ASSIGNS
    console.log("\n--- TEST 2: Owner Assigns Task ---");
    taskRes = await ownerApi.patch(`/tasks/${taskId}/assign`, {
      assignedTo: assignee.user.id
    });
    if (taskRes.data.task.assignedTo === assignee.user.id) console.log("Result: ✅ Passed");
    else console.log("Result: ❌ Failed");

    // TEST 8 — OWNER CANNOT CHANGE PROGRESS
    console.log("\n--- TEST 8: Owner Cannot Change Progress ---");
    try {
      await ownerApi.patch(`/tasks/${taskId}/status`, { status: "in_progress" });
      console.log("Result: ❌ Failed (Should be 403)");
    } catch (e) {
      if (e.response?.status === 403) console.log("Result: ✅ Passed");
      else console.log("Result: ❌ Failed with", e.response?.status);
    }

    // TEST 9 — OTHER RESEARCHER
    console.log("\n--- TEST 9: Other Researcher Cannot Change Progress ---");
    try {
      await otherApi.patch(`/tasks/${taskId}/status`, { status: "in_progress" });
      console.log("Result: ❌ Failed (Should be 403)");
    } catch (e) {
      if (e.response?.status === 403) console.log("Result: ✅ Passed");
      else console.log("Result: ❌ Failed with", e.response?.status);
    }

    // TEST 10 — VIEWER
    console.log("\n--- TEST 10: Viewer Cannot Change Progress ---");
    try {
      await viewerApi.patch(`/tasks/${taskId}/status`, { status: "in_progress" });
      console.log("Result: ❌ Failed (Should be 403)");
    } catch (e) {
      if (e.response?.status === 403) console.log("Result: ✅ Passed");
      else console.log("Result: ❌ Failed with", e.response?.status);
    }

    // TEST 7 — TODO CANNOT SKIP TO COMPLETED
    console.log("\n--- TEST 7: Todo cannot skip to Completed ---");
    try {
      await assigneeApi.patch(`/tasks/${taskId}/status`, { status: "completed" });
      console.log("Result: ❌ Failed (Should be 400)");
    } catch (e) {
      if (e.response?.status === 400) console.log("Result: ✅ Passed");
      else console.log("Result: ❌ Failed with", e.response?.status);
    }

    // TEST 3 — ASSIGNEE STARTS
    console.log("\n--- TEST 3: Assignee Starts Task ---");
    let statusRes = await assigneeApi.patch(`/tasks/${taskId}/status`, { status: "in_progress" });
    if (statusRes.data.task.status === "in_progress") console.log("Result: ✅ Passed");
    else console.log("Result: ❌ Failed");

    // TEST 4 — ASSIGNEE COMPLETES
    console.log("\n--- TEST 4: Assignee Completes Task ---");
    statusRes = await assigneeApi.patch(`/tasks/${taskId}/status`, { status: "completed" });
    if (statusRes.data.task.status === "completed") console.log("Result: ✅ Passed");
    else console.log("Result: ❌ Failed");

    // TEST 5 — COMPLETED CANNOT GO BACK TO TODO
    console.log("\n--- TEST 5: Completed Cannot Go Back to Todo ---");
    try {
      await assigneeApi.patch(`/tasks/${taskId}/status`, { status: "todo" });
      console.log("Result: ❌ Failed (Should be 400)");
    } catch (e) {
      if (e.response?.status === 400) console.log("Result: ✅ Passed");
      else console.log("Result: ❌ Failed with", e.response?.status);
    }

    // TEST 6 — COMPLETED CANNOT GO BACK TO IN_PROGRESS
    console.log("\n--- TEST 6: Completed Cannot Go Back to In Progress ---");
    try {
      await assigneeApi.patch(`/tasks/${taskId}/status`, { status: "in_progress" });
      console.log("Result: ❌ Failed (Should be 400)");
    } catch (e) {
      if (e.response?.status === 400) console.log("Result: ✅ Passed");
      else console.log("Result: ❌ Failed with", e.response?.status);
    }

    // Test Unassigned status change protection
    console.log("\n--- BONUS TEST: Unassigned Task Status Protection ---");
    taskRes = await ownerApi.post(`/projects/${project._id}/tasks`, {
      title: "Unassigned Task",
      assignedTo: null
    });
    let unassignedId = taskRes.data.task._id;
    try {
      await assigneeApi.patch(`/tasks/${unassignedId}/status`, { status: "in_progress" });
      console.log("Result: ❌ Failed (Should be 403)");
    } catch (e) {
      if (e.response?.status === 403) console.log("Result: ✅ Passed");
      else console.log("Result: ❌ Failed with", e.response?.status);
    }

  } catch (err) {
    console.error("Test execution failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

runTests();
