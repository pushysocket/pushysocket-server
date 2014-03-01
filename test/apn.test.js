var assert = require('chai').assert,
	service = require('../lib/apn')

describe('apn service', function(){
	var apnagent
	it('connects', function(done){
		assert.ok(service)
		service.connect(function(err, agent){
			assert.ok(agent)
			apnagent = agent
			assert.isTrue(agent.enabled('sandbox'))
			done()
		})
	})
	it('sends message', function(){
		apnagent.createMessage()
			.device('<a3128b5b 925cec91 978e85d7 b47651f7 1d21faad 638809b7 80b81c15 6d4040a5>')
			.alert('pushysocket just got pushy at ' + new Date())
			.send()

	})
})
