require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
    
    // Attempt to hash password by triggering User schema directly or instantiating
    const u = new User({
      name: "Test",
      email: "test_" + Date.now() + "@test.com",
      password: "Password123"
    });
    
    await u.save();
    console.log("Saved successfully!");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    mongoose.disconnect();
  }
};

test();
