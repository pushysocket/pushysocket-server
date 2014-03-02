
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
				messages = r.data.messages,
				el

			r.observe('messages', function(){
				if(!el){
					el = r.find('.messages')
				}
				el.scrollTop = el.scrollHeight-100;
			}, { defer: true })

			this.on('login', function(e, name){
				var user = {
					id: 123,
					name: name,
					device: '<a3128b5b 925cec91 978e85d7 b47651f7 1d21faad 638809b7 80b81c15 6d4040a5>'
				}
				r.set('user', user)
				console.log('calling login')

				socket.emit('login', user)

				socket.on('refresh', function(msgs){
					msgs.forEach(function(msg){
						messages.push(msg)	
					})
				})

				socket.on('message', function(message){
					messages.push(message)
				})

				socket.on('join', function(message){
					message.message = 'joined chat'
					messages.push(message)
				})

				socket.on('left', function(message){
					message.message = 'left chat'
					messages.push(message)
				})

			})

			this.on('send', function(e, msg){
				r.set('newMsg', '')
				socket.emit('message', { 
					user: r.get('user'),
					message: msg 
				});
			})

			this.on('pause', function(){
				socket.emit('pause', r.get('user'))
			})

			this.on('resume', function(){
				socket.emit('resume', r.get('user'))
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

})