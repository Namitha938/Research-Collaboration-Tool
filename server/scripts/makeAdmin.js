require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
  const email = (process.argv[2] || "").toLowerCase().trim();
  if (!email) {
    console.log("Usage: node scripts/makeAdmin.js your-google-email@gmail.com");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const result = await User.updateOne({ email }, { $set: { role: "admin" } });
  console.log(result);
  await mongoose.disconnect();
})();