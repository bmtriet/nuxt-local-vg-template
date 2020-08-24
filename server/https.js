// server-side
const fs = require('fs');
const server = require('https').createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
});
const io = require('socket.io')(server);
server.listen(2020);

// client-side
const socket = io({
  // option 1
  ca: fs.readFileSync('server.crt'),

  // option 2. WARNING: it leaves you vulnerable to MITM attacks!
  rejectUnauthorized: false
});