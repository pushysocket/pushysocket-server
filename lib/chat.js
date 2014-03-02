
module.exports = function(options){
	var messages = options.messages,
		chat = options.chat,
		push = options.push,
		room = new Room(chat, push)

	chat.on('connection', function(client){ 

		var user
		client.on('login', function(login){
			user = login
			user.sessionId = client.id

			room.emit('join', {
				user: {
					id: user.id,
					name: user.name
				},
				timestamp: new Date()
			})

			refresh()
			client.on('refresh', refresh)
			function refresh(options){
				client.emit('refresh', messages.get(options))
			}
			
			client.on('message', function(msg){
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

			client.on('pause', function(){
				room.pause(user)
			})

			client.on('resume', function(){
				var options = { since: room.resume(user) }
				refresh(options)
			})
		})	

	    client.on('disconnect', function() {
	        chat.emit('left', {
				user: user || { sessionId: client.id },
				timestamp: new Date()
			})
	    })
	})
}

function Room(chat, push){
	var paused = {}

	this.pause = function(user){
		if(paused[user.sessionId]) { return }

		user.paused = new Date()
		paused[user.sessionId] = user
	}

	this.resume = function(user){
		var user = paused[user.sessionId]
		delete paused[user.sessionId]
		if(user) { 
			var time = user.paused
			delete user.paused
			return time
		}
	}

	this.emit = function(name, message){
		chat.emit(name, message)
		for(id in paused) {
			var user = paused[id]
			if(!push || !user.device) { return }

			push.createMessage()
				.device(user.device)
				.alert(message.message)
				.send()

		}
	}
}
