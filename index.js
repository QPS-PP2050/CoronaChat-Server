var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io;

const users = [];

function addUser(id, room)
{
  const user = {
    id, room
  }
  users.push(user);
  return user;
}

function changeChannel(id, channel)
{
  const index = users.findIndex(user => user.id === id);
  users[index]['channel'] = channel;
}

function getChannel(id)
{
  const index = users.findIndex(user => user.id === id);
  //console.log(users[index]['channel']);
  return users[index]['channel'];
}

server = http.Server(app);
server.listen(8080);
console.log("Test");
io = socketIO(server);

io.sockets.on('connection', function (socket) {
  
  const user = {id: socket.id, room: 123}
  socket.join(user.room);
  console.log(`${user.id} Joined ${user.room}`);
  console.log(`${user.id} - Connected`);
  socket.on('message', (data) => {
    console.log(`> ${user.room} ${data}`);
    io.to(user.room).emit('message', data);
  });
  socket.on('disconnect', () => {
    console.log(`${socket.id} - Disconnect`);
  });
  socket.on("channel-change", function(channel){
    socket.leave(user.room);
    socket.join(channel);
    user.room = channel;
    console.log(`${socket.id} Joined ${user.room}`);
  })
});


