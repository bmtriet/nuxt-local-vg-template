const fs = require('fs');
const server = require('https').createServer({
  key: fs.readFileSync('node.key'),
  cert: fs.readFileSync('node.crt')
});
const io = require('socket.io')(server);
let userOnline = [];
io.on('connection', socket => {
  
  socket.on('joinRoom', userLoginData => {
    if (userOnline.map(x => x.id).indexOf(userLoginData.id) === -1) {
      userOnline.push(userLoginData);
    }
    io.emit("notifyNewUserHasLogin", userOnline);
    console.log(userOnline);
  })
  
  
  socket.on("passMsgToClient", data => {
    console.log(data);
    socket.to(data.toId).emit('passMsg', data);
  })
  
  socket.on('disconnect', () => { 
    // socket.broadcast.emit("logOut", socket.id);
    userOnline.splice(userOnline.findIndex(x => x.id === socket.id), 1);
    io.emit("notifyNewUserHasLogin", userOnline);
    console.log('disconnected');
  });
  
  socket.on('getOnlineUser', () => {
    io.emit("notifyNewUserHasLogin", userOnline);
  })
});

server.listen(2020);
console.log('Server listen on 2020');