
var socket = io.connect('/chat')
socket.on('connect', function(){

	socket.on('disconnect', function(){
		console.log('disconnected...')
	})
	
	var ractive = new Ractive({
		el: '#container',
		template: '#chat',
		data: { messages: [] },
		complete: function(){
			var r = this,
				messages = r.data.messages

			this.on('login', function(e, name){
				var user = {
					id: 123,
					name: name,
					device: '<a3128b5b 925cec91 978e85d7 b47651f7 1d21faad 638809b7 80b81c15 6d4040a5>'
				}
				r.set('user', user)
				socket.emit('login', user)

				socket.on('refresh', function(msgs){
					msgs.forEach(function(msg){
						messages.push(msg)	
					})
				})

				socket.on('message', function(message){
					messages.push(message)
				})

				socket.on('join', function(user){
					user.message = 'joined chat'
					messages.push(user)
				})

				socket.on('left', function(user){
					user.message = 'left chat'
					messages.push(user)
				})

			})
			this.on('send', function(e, msg){
				r.set('newMsg', '')
				socket.emit('message', { message: msg });
			})
		},
	  	events: {
			enter_kp: function(node, fire){
				node.addEventListener('keypress', function(e){
					if(e.which===13){ 
						e.preventDefault()
						fire({ node: node })
					}
				})
	  		}
		}
	})

});