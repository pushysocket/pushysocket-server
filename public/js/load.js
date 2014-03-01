
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
				r.set('user', { name: name })
				socket.emit('login', { name: name })

				socket.on('init-messages', function(msgs){
					msgs.forEach(function(msg){
						messages.push(msg)	
					})
				})

				socket.on('message', function(msg){
					messages.push(msg)
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