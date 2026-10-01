const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@researchhub.edu' });

    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@researchhub.edu',
      password: 'AdminPassword123!',
      role: 'admin'
    });

    console.log('Admin user seeded successfully:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
