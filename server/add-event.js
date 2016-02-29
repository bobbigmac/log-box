
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
					if(req.headers instanceof Object && req.headers['user-agent'] && !event['user-agent']) {
						event['user-agent'] = req.headers['user-agent'];
					}
					if(!event.created && event.timestamp) {
						try {
							event.created = new Date(event.timestamp);
						} catch(exc) {}
					}
					if(!event.created) {
						event.created = new Date();
					}
					if(event.levelString && (!event.level || typeof event.level == 'number')) {
						if(typeof event.levelNo === 'undefined') {
							event.levelNo = event.level;
						}
						event.level = event.levelString;
					}
					if(!event.level) {
						event.level = 'info';
					}

					// Validate owner exists and has permission
					var user = Meteor.users.findOne({ apikey: (event.owner+'').toLowerCase() }, { fields: { _id: 1 }});
					if(user) {
						event.owner = user._id;

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