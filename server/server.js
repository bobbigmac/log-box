
Meteor.startup(function () {
	if(typeof AccountsGuest !== 'undefined') {
		AccountsGuest.name = true;
	}
});

Meteor.methods({
	'scrape-url-interest': function(url, interest) {
		if(typeof ScrapeParser === 'undefined') {
			return false;
		}

		var result = ScrapeParser.get(url);
		var interestId = (interest && interest._id);

		if(result) {
			if(result._id) {
				delete result._id;
			}
			if(result.owner) {
				delete result.owner;
			}

			if(interestId) {
				var existing = Interests.findOne(interestId);
				var update = {}, updates = 0;

				Object.keys(result).forEach(function(key, pos) {
					if(!existing.hasOwnProperty(key)) {
						if(!(interest && interest.hasOwnProperty(key))) {
							update[key] = result[key];
							updates++;
						}
					}
				});
				
				if(interest) {
					Object.keys(interest).forEach(function(key, pos) {
						if(!existing[key] || (existing[key] && existing[key] !== interest[key])) {
							update[key] = interest[key];
							updates++;
						}
					});
				}

				//console.log(interest, interestId, update);

				if(updates) {
					Interests.update(interestId, {
						$set: update
					});
				}
			} else {
				result.url = url;
				var userId = Meteor.userId();
				if(userId) {
					result.owner = userId;
				  result.created = new Date();
			  	result.modified = new Date();

					interestId = Interests.insert(Object.assign(result, interest));
				}
			}
		}
		//console.log('interestId', interestId);
		return interestId;
	},
});