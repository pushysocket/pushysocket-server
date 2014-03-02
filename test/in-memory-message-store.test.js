var assert = require('chai').assert,
	Store = require('../lib/in-memory-message-store')

describe('simple memory store', function(){
	var messages = new Store(5)
	function m(t){ return { timestamp: t } }
	it('can add and return items)', function(){
		messages.add(m(1))
		messages.add(m(2))
		messages.add(m(3))

		assert.deepEqual(messages.get(), [m(1),m(2),m(3)])
	})

	it('doesn\'t exceed max', function(){
		messages.add(m(4))
		messages.add(m(5))
		messages.add(m(6))

		assert.deepEqual(messages.get(), [m(2),m(3),m(4),m(5),m(6)])
	})

	it('sets since timestamp', function(){
		messages.add(m(7))
		messages.add(m(8))
		messages.add(m(9))

		var since = messages.get({ since: 7 })
		assert.deepEqual(since, [m(8),m(9)])
	})

	it('works for real dates', function(done){
		var m = new Store(20)
			
		var item1 = { timestamp: Date.now() }
		var item2 = { timestamp: Date.now()+10 }
		var item3 = { timestamp: Date.now()+20 }
		var item4 = { timestamp: Date.now()+30 }
		
		m.add(item1)
		m.add(item2)
		m.add(item3)
		m.add(item4)
	
		var result = m.get({since: item3.timestamp})
		assert.equal(result.length, 1)
		done()

	})
})