var express = require('express'),
    app = express()

app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app),
	io = require('socket.io').listen(server),
	apn = require('./lib/apn')(),
	ChatRoom = require('./lib/chat')

io.set('log level', 1)

var INIT_MESSAGES = 5
function SimpleMessageStore() {
	var self = this,
		INIT_MESSAGES = 5,
		messages = []

	this.add = function(message){
	    if (messages.length >= INIT_MESSAGES) {
	        messages.shift()
	    }
	    messages.push(message)
	}

	this.get = function(options){
		return messages;
	}
}

var join = require('path').join,
	chatapps = [{
	namespace: '/chat',
	certificate: {
		cert: join(__dirname, './_cert/apn-dev-cert.pem'),
		key: join(__dirname, './_cert/apn-dev-key.pem')
	}
}]

chatapps.forEach(function(options){
	console.log(options.certificate.cert, options.certificate.key)
	
	//this will be async too...
	options.messages = new SimpleMessageStore()
	
	//(if push...)
	apn.create(options, function(err, agent){
		if(err){
			console.log('push agent err', err.message)
		}
		options.push = agent
		options.chat = io.of(options.namespace)
		var chatroom = new ChatRoom(options)
	})
})

server.listen(3000);

