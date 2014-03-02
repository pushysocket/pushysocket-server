var assert = require('chai').assert,
	apn = require('../lib/apn')('test'),
	device = '<a3128b5b 925cec91 978e85d7 b47651f7 1d21faad 638809b7 80b81c15 6d4040a5>'

describe('apn service factory', function(){
	describe('first agent', function(){
		var apnagent
		it('connects and returns agent', function(done){
			apn.create(function(err, agent){
				assert.notOk(err)
				assert.ok(agent, 'returns agent')
				apnagent = agent
				assert.isFalse(agent.enabled('sandbox'))
				done()
			})
		})
		it('sends message', function(done){
			var message = 'This is the message'
			apnagent.on('mock:message', function(body){
				assert.equal(body.payload.aps.alert, message)
				done()
			})
			apnagent.createMessage()
				.device(device)
				.alert(message)
				.send()
		})
	})
	describe('second agent', function(){
		it('can send message', function(done){
			apn.create(function(err, agent){
				assert.notOk(err)
				assert.ok(agent, 'returns agent')
				assert.isFalse(agent.enabled('sandbox'))
				
				var message = 'Second message'

				agent.on('mock:message', function(body){
				assert.equal(body.payload.aps.alert, message)
					done()
				})	

				agent.createMessage()
					.device(device)
					.alert(message)
					.send()
			})


		})
	})

})
