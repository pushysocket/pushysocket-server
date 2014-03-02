
module.exports = function(options){
	var messages = options.messages,
		chat = options.chat,
		push = options.push,
		room = new Room(chat, push),
		users = {}

	chat.on('connection', function(client){ 
		
		console.log('connected', client)


		client.on('login', function(user){
			client.set('user', user, function () {
      			client.emit('ready')
    		
				if(!user) { return }
				console.log('login', user.name, client.id)

				room.emit('join', {
					user: {
						id: user.id,
						name: user.name
					},
					timestamp: new Date()
				})

				refresh()
			})
		})	

		client.on('refresh', function(){
			console.log('refresh')
			refresh()
		})
	
		function refresh(options){
		
			client.emit('refresh', messages.get(options))
		}


		client.on('message', function(msg){
		  	client.get('user', function (err, user) {
		  		if(err || !user){
		  			console.log('invalid message')
		  			return
		  		}

		      	console.log('Chat message by ', user.name);

				var message = {
					user: {
						id: msg.user.id,
						name: msg.user.name
					},
					timestamp: new Date(),
					message: msg.message
				}

				message.id = Math.floor(Math.random() * 10) 
					+ (+message.timestamp).toString(36)
	        	messages.add(message)
				room.emit('message', message)
			})
		})

		client.on('pause', function(user){
			if(!user) { return }
			room.pause(user)
		})

		client.on('resume', function(user){
			if(!user) { return }
			var options = { since: room.resume(user) }
			refresh(options)
		})

	    client.on('disconnect', function() {
			// if(!user) { return }

	  //       chat.emit('left', {
			// 	user: user,
			// 	timestamp: new Date()
			// })

	    })
	})
}

function Room(chat, push){
	var paused = {}

	this.pause = function(user){
		if(paused[user.device]) { return }

		user.paused = new Date()
		paused[user.device] = user
	}

	this.resume = function(user){
		var user = paused[user.device]
		delete paused[user.device]
		if(user) { return user.paused }
	}

	this.emit = function(name, message){

		chat.emit(name, message)
		
		if(!push) { return }

		for(device in paused) {
			var user = paused[device]
			if(user && user.device) {
				push.createMessage()
					.device(user.device)
					.alert(message.message)
					.send()
			}
		}
		
	}
}
