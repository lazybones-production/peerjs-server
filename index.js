var PeerServer = require('peer').PeerServer,
  express = require('express'),
  app = express(),
  port = process.env.PORT || 3001;

var expressServer = app.listen(port);
var io = require('socket.io').listen(expressServer);

var peerServer = new PeerServer({ port: 9000, path: '/peer' });

var USERS_LIST_EVENT = 'USERS_LIST_EVENT';
var connectedUsers = [];

peerServer.on('connection', function (id) {
  connectedUsers = connectedUsers.concat(id);
  io.emit(USERS_LIST_EVENT, connectedUsers);
  console.log('User connected with #', id);
});

peerServer.on('disconnect', function (id) {
  connectedUsers = connectedUsers.filter(_id => _id !== id);
  io.emit(USERS_LIST_EVENT, connectedUsers);
  console.log('User disconnected with #', id);
});
