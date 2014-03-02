
function Chat(options){
	var messageStore = options.messages,
		chat = options.chat,
		push = options.push,
		room = new Room(chat)

	chat.on('connection', function(client){ 

		client.on('login', function(user){
			user.sessionId = client.id

			var toUser = client.emit,
				toRoom = room.emit

			toRoom('join', { user: user })
			refresh()
			client.on('refresh', refresh)
			function refresh(options){
				toUser('refresh', messageStore.get(options))
			}
			
			client.on('message', function(msg){
				var message = {
					user: user,
					timestamp: new Date(),
					message: msg.message
				}

				message.id = Math.floor(Math.random() * 10) 
					+ (+message.timestamp).toString(36)
	        	messagesStore.add(message)
				toRoom('message', message)
			})

			client.on('pause', function(){
				room.pause(user)
			})

			client.on('resume', function(){
				var options = { since: room.pause(user) }
				refresh(options)
			})
		})	

	    client.on('disconnect', function() {
	        chat.emit('left', {
				user: user || { sessionId: client.id }
			})
	    })
	})
}

function Room(chat){
	var paused = {}

	this.pause = function(user){
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
		paused.forEach(function(user){
			if(!push || !user.device) { return }

			//TODO: push.send()
		
		})
	}
}
