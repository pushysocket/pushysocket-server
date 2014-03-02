var express = require('express'),
    app = express()

app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app),
	io = require('socket.io').listen(server) //,
	apn = require('./lib/apn')(),
	//ChatRoom = require('./lib/chat'),
	Store = require('./lib/in-memory-message-store')

io.set('log level', 0)



var join = require('path').join,
	fs = require('fs'),
	chatapps = [{
	namespace: '/chat',
	certificate: {
		cert: fs.readFileSync(join(__dirname, './_cert/Certificates.p12')),
		passphrase: 'pushysocket'
	}
}]


chatapps.forEach(function(options){
	var messages = new Store(15)
	
		var chat = io.of('/chat'), 
			room = new Room(chat /*, agent*/)

		//(if push...)
		apn.create(options, function(err, agent){
			if(err){
				console.log('push agent err', err.message)
			} else {
				room.push = agent
			}	
		})	

		chat.on('connection', function(socket){
			console.log('connected')
			socket.on('login', function(user){
				
				if(!user) { 
					console.log('aborting, no user at login')	
					return 
				}
				console.log('login', user.name, socket.id)

				refresh()

				room.emit('join', {
					user: {
						id: user.id,
						name: user.name
					},
					timestamp: new Date()
				})


				function refresh(options){
					socket.emit('refresh', messages.get(options))
				}

				socket.on('refresh', function(){
					console.log('refresh')
					refresh()
				})

				socket.on('message', function(msg){
				    console.log('Chat message by ', user.name);
					
					var message = {
						user: {
							id: user.id,
							name: user.name
						},
						timestamp: new Date(),
						message: msg.message
					}

					message.id = Math.floor(Math.random() * 10) 
						+ (+message.timestamp).toString(36)
		        	messages.add(message)
					room.emit('message', message)
					
				})

				socket.on('pause', function(){
					room.pause(user)
				})

				socket.on('resume', function(){
					var since = room.resume(user)
					refresh( { since: since })
				})

			    socket.on('disconnect', function() {
				
			        chat.emit('left', {
						user: {
							id: user.id,
							name: user.name
						},
						timestamp: new Date()
					})

			    })


			})

		})
	// })

})
function Room(chat){
	var self = this,
		paused = {}

	this.pause = function(user){
		if(paused[user.device]) { return }

		user.paused = new Date()
		paused[user.device] = user
	}

	this.resume = function(usr){
		var user = paused[usr.device]
		delete paused[usr.device]
		if(user) { return user.paused }
	}

	this.emit = function(name, message){

		chat.emit(name, message)
		
		if(!self.push) { return }

		for(device in paused) {
			var user = paused[device]
			if(user && user.device) {
				console.log('creating push for', user.name)
				self.push.createMessage()
					.device(user.device)
					.alert(message.message)
					.send()
			}
		}
		
	}
}

server.listen(3000);

