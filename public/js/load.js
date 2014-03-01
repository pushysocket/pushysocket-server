
var socket = io('/chat')
socket.on('connect', function(){


	socket.on('disconnect', function(){});
	
	var ractive = new Ractive({
		el: '#container',
		template: '#chat',
		data: { messages: [] },
		complete: function(){
			var r = this
			this.on('login', function(e, name){
				r.set('user', { name: name })
				socket.emit('login', { name: name })

				socket.on('init-messages', function(messages){
					messages.forEach(function(msg){
						r.data.messages.push(msg)	
					})
				})

				socket.on('message', function(data){
					console.log('message')
					r.data.messages.push(data)
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