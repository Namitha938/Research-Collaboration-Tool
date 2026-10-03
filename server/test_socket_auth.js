const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./models/User');
const { io } = require('socket.io-client');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOne({});
  if (!user) {
    console.log('No user found');
    process.exit(1);
  }
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  console.log('Connecting to socket with valid token for user:', user._id);
  
  const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Connected successfully!');
    process.exit(0);
  });

  socket.on('connect_error', (err) => {
    console.log('Connect error:', err.message);
    process.exit(1);
  });
});
