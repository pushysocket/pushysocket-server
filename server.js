var express = require('express'),
    app = express()

app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){ 
  socket.on('event', function(data){
    console.log('message: ', data);
  });
});
server.listen(3000);

