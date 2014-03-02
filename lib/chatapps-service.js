var request = require('request'),
	qs = require('querystring')
//TODO: move to config
var url = 'https://pushysocket.herokuapp.com/api/customers?'
url +=	qs.stringify({ api_key:'foobar'})

module.exports = {
  	get: function(cb){
		request(url, function (err, response, body) {
			if(err) { cb(err) }
			if(response.statusCode != 200) { cb('Unexpectged response' + response.statusCode) }
			cb(null, JSON.parse(body))
  		})
  	}
}
