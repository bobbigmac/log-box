
WebApp.connectHandlers.use('/add', 
	Meteor.bindEnvironment(function(req, res, next) 
{
	var content = false, code = 0;
	try {
		var event = (req.body instanceof Object && req.body) || false;
				event = event || (req.query instanceof Object && req.query) || false;

		if(event) {
			//console.log('event', event);
			if(event.owner) {
				var eventKeys = Object.keys(event);
				if(eventKeys.length > 1) {

					// Set remotes in case it was sent from client-side
					if(req.headers instanceof Object && req.headers['user-agent'] && !event['user-agent']) {
						event['user-agent'] = req.headers['user-agent'];
					}
					if(!event.ip) {
						event['ip-address'] = //req.headers['x-forwarded-for'] || //spoofable, maybe useful in future
				     (req.connection && req.connection.remoteAddress) || 
				     (req.socket && req.socket.remoteAddress) ||
				     (req.connection && req.connection.socket.remoteAddress);
					}

					// Enforce created (or from timestamp)
					if(!event.created && event.timestamp) {
						try {
							event.created = new Date(event.timestamp);
						} catch(exc) {}
					}
					if(!event.created) {
						event.created = new Date();
					}

					// Enforce a level property (bodgy)
					if((event.levelString || event.LevelString) && (!event.level || typeof event.level == 'number')) {
						if(typeof event.levelNo === 'undefined') {
							event.levelNo = event.level;
						}
						event.level = (event.levelString || event.LevelString);
						delete event.levelString;
					}
					if(!event.level) {
						event.level = 'info';
					}

					//TODO: Probably worth pushing these to a temp collection then processing separately via observer, to speed up this process for the caller.

					// Validate owner exists and has permission
					var product = Products.findOne({ apikey: (event.owner+'').toLowerCase() }, { fields: { _id: 1, owner: 1 }});
					if(product) {
						event.product = product._id;
						event.owner = product.owner;

						// Add new event for user
						content = Events.insert(event);
						code = 200;
					} else {
						code = 401;
					}
				}
			}
		}
	} catch(exc) {
		console.log(exc);
		code = 500;
	}

	if(!code) {
		code = 400;
	}

	if(code) {
		res.statusCode = ""+code;
	}

	if(content) {
		var type = 'text/plain';
		if(typeof content !== 'string') {
			type = 'application/json';
			content = JSON.stringify(content);
		}

		res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
		res.setHeader('Content-Type', type);
		res.write(content);
	}

	res.end();
	return;
}));