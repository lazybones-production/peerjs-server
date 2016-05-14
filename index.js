var http = require('http');
var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
var port = process.env.PORT || 5000;
var lodash = require('lodash');

var server = http.createServer(app);

var options = {
    debug: true
};

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var peerServer = ExpressPeerServer(server, options);
app.use('/peerjs', peerServer);

var io = require('socket.io')(server);

server.listen(port, function () {
  console.log('server listen: ', port);
});

var USERS_LIST_EVENT = 'USERS_LIST_EVENT';
var connectedUsers = [];

// peer js
peerServer.on('connection', function (id) {
  var userID = id + '-' + lodash.uniqueId();
  connectedUsers = connectedUsers.concat(userID);
  io.emit(USERS_LIST_EVENT, connectedUsers);
  console.log('User connected with #', userID);
});

peerServer.on('disconnect', function (id) {
  connectedUsers = connectedUsers.filter(_id => _id !== id);
  io.emit(USERS_LIST_EVENT, connectedUsers);
  console.log('User disconnected with #', id);
});
