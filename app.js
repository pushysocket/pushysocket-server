var express = require('express'),
    app = express()

app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var chat1 = io.of('/chat1'),
	chat2 = io.of('/chat2')

/*
chat1.on('connection', function(client){
	console.log('new connection for', 'chat1', client.id)
})
chat2.on('connection', function(client){
	console.log('new connection for', 'chat2', client.id)
})
*/
var chatname = 'chat',
	chat = io.of('/' + chatname),
	messages = [],
	INIT_MESSAGES = 5

Array.prototype.inject = function(element) {
    if (this.length >= INIT_MESSAGES) {
        this.shift()
    }
    this.push(element)
}

chat.on('connection', function(client){ 
	
	var user
	client.on('login', function(usr){
		//console.log('user', user.name)
		user = usr
		chat.emit('message', {
			user: chatname,
			message: user.name + ' has joined'
		})

    	client.emit("init-messages", messages)

		client.on('message', function(msg){
			//console.log(user.name, ':', msg.message)
			var message = {
				user: user.name,
				message: msg.message
			}
        	messages.inject(message)
			chat.emit('message', message)
		})
	})	

    client.on('disconnect', function() {
        chat.emit('message', {
			user: chatname,
			message: (user ? user.name : '<unknown>') + ' has left'
		})
    })

  
});

server.listen(3000);
