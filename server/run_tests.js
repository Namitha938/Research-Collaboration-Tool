require("dotenv").config({ path: "./.env" });
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
const User = require("./models/User");
const Project = require("./models/Project");
const ResearchPaper = require("./models/ResearchPaper");
const Reference = require("./models/Reference");
const { formatCitation } = require("./utils/citationFormatter");

async function runTests() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  // Clean previous test data
  await User.deleteMany({ email: /@testrunner\.com/ });
  await Project.deleteMany({ title: /TEST_RUNNER/ });
  await Reference.deleteMany({ title: /TEST_RUNNER/ });

  // 1. Create Users
  const owner = await User.create({ name: "Owner", email: "owner@testrunner.com", password: "password123", role: "researcher" });
  const researcher = await User.create({ name: "Researcher", email: "researcher@testrunner.com", password: "password123", role: "researcher" });
  const viewer = await User.create({ name: "Viewer", email: "viewer@testrunner.com", password: "password123", role: "researcher" });
  const outsider = await User.create({ name: "Outsider", email: "outsider@testrunner.com", password: "password123", role: "researcher" });

  // 2. Create Project
  const project = await Project.create({
    title: "TEST_RUNNER_PROJECT",
    description: "test",
    researchArea: "test",
    owner: owner._id,
    members: [
      { user: researcher._id, role: "researcher" },
      { user: viewer._id, role: "viewer" }
    ]
  });

  const otherProject = await Project.create({
    title: "TEST_RUNNER_OTHER",
    description: "test",
    researchArea: "test",
    owner: outsider._id,
    members: []
  });

  const paper = await ResearchPaper.create({
    project: project._id,
    title: "TEST_RUNNER_PAPER",
    abstract: "test",
    authors: ["Test"],
    addedBy: owner._id,
    status: "to_read"
  });

  const otherPaper = await ResearchPaper.create({
    project: otherProject._id,
    title: "TEST_RUNNER_OTHER_PAPER",
    abstract: "test",
    authors: ["Test"],
    addedBy: outsider._id,
    status: "to_read"
  });

  let testFailures = [];

  // Helper to test controller logic manually using mocking
  const referenceController = require("./controllers/referenceController");
  
  const mockRequest = (userId, projectId, body = {}, params = {}, query = {}) => ({
    user: { _id: userId },
    params: { projectId, ...params },
    body,
    query
  });

  const mockResponse = () => {
    const res = {};
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.data = data; return res; };
    return res;
  };

  try {
    // TEST 1: Viewer Cannot Add Reference
    let req = mockRequest(viewer._id, project._id, { title: "TEST_RUNNER_REF", citationStyle: "APA" });
    let res = mockResponse();
    await referenceController.createReference(req, res);
    if (res.statusCode !== 403) testFailures.push("Viewer was able to create reference (expected 403)");

    // TEST 2: Owner Can Add Reference
    req = mockRequest(owner._id, project._id, { title: "TEST_RUNNER_REF", authors: ["Owner"], citationStyle: "APA", publicationYear: 2024 });
    res = mockResponse();
    await referenceController.createReference(req, res);
    if (res.statusCode !== 201) testFailures.push("Owner failed to create reference");
    const ownerRefId = res.data?.reference?._id;

    // TEST 3: Researcher Can Add Reference
    req = mockRequest(researcher._id, project._id, { title: "TEST_RUNNER_REF_2", authors: ["Researcher"], citationStyle: "IEEE" });
    res = mockResponse();
    await referenceController.createReference(req, res);
    if (res.statusCode !== 201) testFailures.push("Researcher failed to create reference");
    const researcherRefId = res.data?.reference?._id;

    // TEST 4: Researcher Cannot Edit Owner's Reference
    req = mockRequest(researcher._id, null, { title: "Hacked" }, { referenceId: ownerRefId });
    res = mockResponse();
    await referenceController.updateReference(req, res);
    if (res.statusCode !== 403) testFailures.push("Researcher could edit owner's reference");

    // TEST 5: Owner Can Edit Researcher's Reference
    req = mockRequest(owner._id, null, { title: "Owner Edited" }, { referenceId: researcherRefId });
    res = mockResponse();
    await referenceController.updateReference(req, res);
    if (res.statusCode !== 200) testFailures.push("Owner could not edit researcher's reference");

    // TEST 6: Outsider Cannot Access Reference
    req = mockRequest(outsider._id, null, {}, { referenceId: ownerRefId });
    res = mockResponse();
    await referenceController.getReference(req, res);
    if (res.statusCode !== 403) testFailures.push("Outsider could access reference");

    // TEST 7: Cannot Link Paper from Another Project
    req = mockRequest(owner._id, project._id, { title: "TEST_RUNNER_REF_3", researchPaper: otherPaper._id });
    res = mockResponse();
    await referenceController.createReference(req, res);
    if (res.statusCode !== 400) testFailures.push("Allowed linking paper from another project");

    // TEST 8: Can Link Paper from Same Project
    req = mockRequest(owner._id, project._id, { title: "TEST_RUNNER_REF_4", researchPaper: paper._id });
    res = mockResponse();
    await referenceController.createReference(req, res);
    if (res.statusCode !== 201) testFailures.push("Failed to link valid paper from same project");

    // TEST 9: Formatter test
    const formatted = formatCitation({ title: "Test", authors: ["A. Smith"], publicationYear: 2024, citationStyle: "APA" });
    if (!formatted.includes("A. Smith") || !formatted.includes("2024")) testFailures.push("Formatter APA output looks wrong: " + formatted);

    // Filter test
    req = mockRequest(viewer._id, project._id, {}, {}, { citationStyle: "APA" });
    res = mockResponse();
    await referenceController.getReferences(req, res);
    if (res.statusCode !== 200 || !res.data.references.every(r => r.citationStyle === "APA")) testFailures.push("Filter by citationStyle failed");

  } catch (e) {
    testFailures.push("Exception during tests: " + e.message);
  }

  if (testFailures.length > 0) {
    console.error("BACKEND TESTS FAILED:");
    testFailures.forEach(f => console.error(" - " + f));
  } else {
    console.log("ALL BACKEND TESTS PASSED.");
  }

  process.exit(0);
}

runTests();
