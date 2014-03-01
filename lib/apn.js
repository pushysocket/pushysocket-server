var join = require('path').join

var apnagent = require('apnagent')
  , agent = new apnagent.Agent()
  , service = module.exports = {
  	connect: function(cb){
  		agent
		    .set('cert file', join(__dirname, '../_cert/apn-dev-cert.pem'))
		    .set('key file', join(__dirname, '../_cert/apn-dev-key.pem'))
		    //or this works too:
		    // .set('pfx file', join(__dirname, '../_cert/Certificates.p12'))
		    // .set('passphrase', 'pushysocket')
		 	.enable('sandbox')

		agent.connect(function(err){
			if (err) {
				//if(err.name === 'GatewayAuthorizationError') {
				cb(err)
			}
			cb(null, agent)

		})
  	}
  }
