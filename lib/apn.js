var apnagent = require('apnagent')

module.exports = function(env){

	return {
		create: function(options, cb){
			if(typeof options==='function') { cb = options }
			
			var agent = getAgent(options)
			agent
				.set('expires', '1d')
				.set('reconnect delay', '1s')
				.set('cache ttl', '30m')
				.connect(function(err){
					if (err) {
						//if(err.name === 'GatewayAuthorizationError') {
						cb(err)
					}
					agent.on('message:error', error)
					cb(null, agent)
				})
		}
	}


	function getAgent(options){
		var agent
		if(env==='test'){
			agent = new apnagent.MockAgent()
		} else {
			agent = new apnagent.Agent()
			agent 
			    .set('pfx', options.certificate.cert)
			    .set('passphrase', options.certificate.passphrase)
			    //.enable('sandbox')
		}
		return agent
	}
}



function error(err, msg) {
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
}