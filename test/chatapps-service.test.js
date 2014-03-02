var assert = require('chai').assert,
	service = require('../lib/chatapps-service')

describe('chat apps service', function(){
	it('returns weather data (haha)', function(done){
		service.get(function(err, data){
			assert.ok(data)
			done()
		})
	})
})
