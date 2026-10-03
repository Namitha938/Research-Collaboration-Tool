const http = require('http');
http.get('http://localhost:5000/socket.io/?EIO=4&transport=polling', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
}).on('error', err => console.log('Error:', err.message));
