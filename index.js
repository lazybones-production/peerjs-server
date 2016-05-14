'use strict';

var PeerServer = require('peer').PeerServer;
var express = require('express');
var app = express();
var port = process.env.PORT || 3001;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var expressServer = app.listen(port);
var io = require('socket.io').listen(expressServer);

console.log('Listening on port', port);

var peerServer = new PeerServer({ port: 9000, path: '/chat' });

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
