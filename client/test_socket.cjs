const { io } = require('socket.io-client');
console.log('Connecting to socket...');
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  auth: { token: 'invalid_token' }
});

socket.on('connect', () => {
  console.log('Connected!');
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.log('Connect error:', err.message);
  process.exit(1);
});

setTimeout(() => {
  console.log('Timeout');
  process.exit(1);
}, 5000);
