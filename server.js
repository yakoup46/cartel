var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/board.html');
});

http.listen(1337);
