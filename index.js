var ExpressPeerServer = require('peer').ExpressPeerServer,
  express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),

  port = process.env.PORT || 3001;

var USERS_LIST_EVENT = 'USERS_LIST_EVENT';
var connectedUsers = [];

app.get('/', function(req, res, next) { res.send('Hello world!'); });

app.use('/peerjs', ExpressPeerServer(server, {port: 9000}));

server.on('connection', function (id) {
  connectedUsers = connectedUsers.concat(id);
  io.emit(USERS_LIST_EVENT, connectedUsers);
  console.log('User connected with #', id);
});

server.on('disconnect', function (id) {
  connectedUsers = connectedUsers.filter(_id => _id !== id);
  io.emit(USERS_LIST_EVENT, connectedUsers);
  console.log('User disconnected with #', id);
});

server.listen(port);
