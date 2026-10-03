const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let tokenOwner = '';
let tokenResearcher = '';
let projectId = '';
let referenceId = '';
let paperId = '';
let otherProjectId = ''; // For cross-project test

async function runTests() {
  try {
    console.log("1. Authenticate users...");
    // We assume tester@antigravity.com is an owner or researcher. We need two accounts.
    // Let's just register two temp users for the test.
    const ownerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Owner User',
      email: `owner_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'researcher'
    });
    tokenOwner = ownerRes.data.token;

    const researcherRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Researcher User',
      email: `researcher_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'researcher'
    });
    tokenResearcher = researcherRes.data.token;

    const viewerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Viewer User',
      email: `viewer_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'researcher'
    });
    let tokenViewer = viewerRes.data.token;

    console.log("2. Create projects...");
    const projRes = await axios.post(`${BASE_URL}/projects`, {
      title: 'API Test Project',
      description: 'Test',
      researchArea: 'Test Area'
    }, { headers: { Authorization: `Bearer ${tokenOwner}` } });
    projectId = projRes.data.project._id;

    const otherProjRes = await axios.post(`${BASE_URL}/projects`, {
      title: 'Other API Test Project',
      description: 'Test 2',
      researchArea: 'Test Area'
    }, { headers: { Authorization: `Bearer ${tokenOwner}` } });
    otherProjectId = otherProjRes.data.project._id;

    // Add researcher and viewer to the project
    // Wait, the project invitation flow might be complex. Let's just create a project and invite them? 
    // Wait, let's look at the database directly to add members for testing, it's faster.
  } catch(e) {
    console.error(e.response?.data || e.message);
  }
}

runTests();
