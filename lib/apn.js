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

			agent.on('message:error', function (err, msg) {
				switch (err.name) {
					// This error occurs when Apple reports an issue parsing the message.
					case 'GatewayNotificationError':
						console.log('[message:error] GatewayNotificationError: %s', err.message);

						// The err.code is the number that Apple reports.
						// Example: 8 means the token supplied is invalid or not subscribed
						// to notifications for your application.
						if (err.code === 8) {
							console.log('    > %s', msg.device().toString());
							// In production you should flag this token as invalid and not
							// send any futher messages to it until you confirm validity
					  	}
					  	break;

					// This happens when apnagent has a problem encoding the message for transfer
					case 'SerializationError':
					  console.log('[message:error] SerializationError: %s', err.message);
					  break;

					// unlikely, but could occur if trying to send over a dead socket
					default:
					  console.log('[message:error] other error: %s', err.message);
					  break;
				  }
			})

			cb(null, agent)

		})
	}
  }
