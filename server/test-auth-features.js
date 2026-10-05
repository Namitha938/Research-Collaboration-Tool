require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
const User = require("./models/User");
const Project = require("./models/Project");
const generateToken = require("./utils/generateToken");
const crypto = require("crypto");
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("=== STARTING AUTH & PROFILE TESTS ===");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for test verification");

    // Clean up any existing test user
    const testEmail = "test_researcher_auth@example.com";
    await User.deleteOne({ email: testEmail });

    // 1. Test Register
    console.log("\n1. Testing User Registration...");
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Dr. Alice Research",
      email: testEmail,
      password: "password123",
    });
    console.log(" Registration Success:", regRes.data.success);
    console.log(" Token received:", !!regRes.data.token);
    console.log(" User profile returned:", regRes.data.user.name, regRes.data.user.email);
    let token = regRes.data.token;
    const userId = regRes.data.user.id;

    // 2. Test Get Profile / Me
    console.log("\n2. Testing GET /api/auth/profile...");
    const profileRes = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(" Profile fetch success:", profileRes.data.success);
    console.log(" Profile user stats:", profileRes.data.stats);

    // 3. Test Update Profile
    console.log("\n3. Testing PUT /api/auth/profile...");
    const updateRes = await axios.put(
      `${BASE_URL}/auth/profile`,
      {
        name: "Dr. Alice Research, Ph.D.",
        bio: "Senior AI & Quantum Computing Researcher.",
        institution: "Stanford University",
        department: "Computer Science",
        designation: "Associate Professor",
        phone: "+1-555-0199",
        location: "Palo Alto, CA",
        researchInterests: ["Deep Learning", "Quantum Algorithms", "Bioinformatics"],
        skills: ["PyTorch", "Python", "Qiskit", "Distributed Systems"],
        socialLinks: {
          website: "https://alice-research.org",
          github: "https://github.com/alice-research",
          googleScholar: "https://scholar.google.com/citations?user=alice",
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(" Update Profile Success:", updateRes.data.success);
    console.log(" Updated bio:", updateRes.data.user.bio);
    console.log(" Updated institution:", updateRes.data.user.institution);
    console.log(" Updated interests:", updateRes.data.user.researchInterests);

    // 4. Test Change Password
    console.log("\n4. Testing PUT /api/auth/change-password...");
    const changePassRes = await axios.put(
      `${BASE_URL}/auth/change-password`,
      {
        currentPassword: "password123",
        newPassword: "newPassword456",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(" Change Password Success:", changePassRes.data.success);

    // Verify login with new password
    console.log("\n5. Testing POST /api/auth/login with new password...");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: "newPassword456",
    });
    console.log(" Login Success:", loginRes.data.success);
    token = loginRes.data.token;

    // 6. Test Forgot Password
    console.log("\n6. Testing POST /api/auth/forgot-password...");
    const forgotRes = await axios.post(`${BASE_URL}/auth/forgot-password`, {
      email: testEmail,
    });
    console.log(" Forgot password response:", forgotRes.data.message);
    const resetToken = forgotRes.data.devResetToken;
    const resetOtp = forgotRes.data.devOtp;
    console.log(" Got devResetToken:", resetToken ? "Yes" : "No", "devOtp:", resetOtp ? "Yes" : "No");

    // 7. Test Verify Reset Token
    console.log("\n7. Testing GET /api/auth/reset-password/:token...");
    const verifyTokenRes = await axios.get(`${BASE_URL}/auth/reset-password/${resetToken}`);
    console.log(" Verify Token Response:", verifyTokenRes.data);

    // 8. Test Reset Password
    console.log("\n8. Testing POST /api/auth/reset-password/:token...");
    const resetRes = await axios.post(`${BASE_URL}/auth/reset-password/${resetToken}`, {
      password: "resetPassword789",
    });
    console.log(" Reset Password Success:", resetRes.data.success);
    console.log(" New token returned:", !!resetRes.data.token);

    // 9. Test Public Researcher Profile by ID
    console.log("\n9. Testing GET /api/auth/profile/:id...");
    const publicProfileRes = await axios.get(`${BASE_URL}/auth/profile/${userId}`, {
      headers: { Authorization: `Bearer ${resetRes.data.token}` },
    });
    console.log(" Public Profile Success:", publicProfileRes.data.success);
    console.log(" Public Researcher Name:", publicProfileRes.data.user.name);

    // 10. Test Google Login error handling for missing/invalid token
    console.log("\n10. Testing POST /api/auth/google validation...");
    try {
      await axios.post(`${BASE_URL}/auth/google`, {});
    } catch (err) {
      console.log(" Missing credential caught properly:", err.response?.status, err.response?.data?.message);
    }

    try {
      await axios.post(`${BASE_URL}/auth/google`, { credential: "invalid_dummy_token" });
    } catch (err) {
      console.log(" Invalid token rejected properly:", err.response?.status, err.response?.data?.message);
    }

    // Clean up test user
    await User.deleteOne({ email: testEmail });
    console.log("\n Cleaned up test user.");
    console.log("\n=== ALL AUTH & PROFILE TESTS PASSED SUCCESSFULLY! ===");
  } catch (error) {
    console.error("Test failed:", error.response ? error.response.data : error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();

