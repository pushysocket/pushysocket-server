var assert = require('chai').assert,
	apn = require('../lib/apn')('test'),
	device = '<a3128b5b 925cec91 978e85d7 b47651f7 1d21faad 638809b7 80b81c15 6d4040a5>'

describe('apn service factory', function(){
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
	it('sends message', function(){
		var message = 'This is the message'
		apnagent.on('message:mock', function(body){
			assert.equal(body, message)
			done()
		})
		apnagent.createMessage()
			.device(device)
			.alert(message)
			.send()
	})
	it('sends second message', function(){
		var message = 'Second message'
		apnagent.on('message:mock', function(body){
			assert.equal(body, message)
			done()
		})
		apnagent.createMessage()
			.device(device)
			.alert(message)
			.send()
	})
	
	it('can create second instance', function(done){
		apn.create(function(err, agent){
			assert.notOk(err)
			assert.ok(agent, 'returns agent')
			assert.isFalse(agent.enabled('sandbox'))
			
			/*
			apnagent.on('message:mock', function(){
				throw "Should not receive message"
			})
			*/

			agent.on('message:mock', function(body){
				assert.equal(body, message)
				done()
			})	

			var message = 'Second message'
			agent.createMessage()
				.device(device)
				.alert(message)
				.send()
		})


	})

})
