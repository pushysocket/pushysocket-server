pushysocket-server
=================

Realtime as a Service. 

Add durable chat to apps:
- Our smart backend keeps the conversation going with web sockets and push notifications.
- You integrate our client SDK's into your mobile apps and web sites for easy integration and ready-made chat UI's (or roll your own).


Chat API
--------

	//no other messages possible until after login

	//user format is open, general guidance:
	var user = {
		id: 123, //meaningful app id, not used by pushysocket
		name: name, //display name
		device: '<...>' //device token for apn
	}	
	
	socket.emit('login', user)

	//login triggers
	socket.on('refresh', function(messages){
		messages.forEach(...
		//where each message is
		{
			user: { 
				id: <id>, 
				name: <displayname> 
			},
			timestamp: <datetime>,
			message: <text message>
		}
	})	

	socket.emit('message', { message: <textmessage> })
	
	//commences apn push notifications
	socket.emit('pause') 

	//stops apn push notifications and response with refresh
	socket.emit('resume')

	socket.on('message', function(message){
		//where message is
		{
			user: { 
				id: <id>, 
				name: <displayname> 
			},
			timestamp: <datetime>,
			message: <text message>
		}
	})

	socket.on('join', function(message){
		//where message is
		{
			user: { 
				id: <id>, 
				name: <displayname> 
			},
			timestamp: <datetime>
		}
	})

	socket.on('left', function(message){
		//where message is
		{
			user: { 
				id: <id>, 
				name: <displayname> 
			},
			timestamp: <datetime>
		}
	})

