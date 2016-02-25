
if (Meteor.isServer) {
	Meteor.startup(function () {
		WebApp.connectHandlers.use(function(req, res, next) {
			var urlParts = req.url && req.url.split(/[\/?]/);
			
			if(urlParts.length > 1 && urlParts[1] === 'add') {
				var content = false, code = 0;
				try {
					var event = (req.body instanceof Object && req.body) || false;
							event = event || (req.query instanceof Object && req.query) || false;

					if(event) {
						if(event.owner) {
							var eventKeys = Object.keys(event);
							if(eventKeys.length > 1) {
								if(req.headers instanceof Object && req.headers['user-agent'] && !event['user-agent']) {
									event['user-agent'] = req.headers['user-agent'];
								}
								if(!event.created) {
									event.created = new Date();
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
					//Worth reporting to myself? ;)
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
			}
			next();
			return;
		});
	});
}