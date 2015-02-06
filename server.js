var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/lib'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/board.html');
});

io.on('connection', function(socket){
    socket.on('roll-dice', function(){
        var firstDie = Math.ceil(Math.random() * 6) - 1;
        var secndDie = Math.ceil(Math.random() * 6) - 1;

        setTimeout(function(){
            socket.emit('keep-rolling');
            socket.emit('dice-rolled', firstDie, secndDie);
        }, 1000);
    });
});

http.listen(1337);
