
Meteor.publish('event', function(id) {
	return Events.find(id);
});

Meteor.publish('apikey', function() {
	if(this.userId) {
		return Meteor.users.find(this.userId, { fields: { apikey: 1 }});
	}
	this.ready();
	return;
});

Meteor.publish('events', function(options) {
	options = (options && options instanceof Object && options) || {};

	if(this.userId) {
		var filter = (options.filter && options.filter instanceof Object && options.filter) || {};
		var fields = (options.fields && options.fields instanceof Object && options.fields) || false;
		var sort = (options.sort && options.sort instanceof Object && options.sort) || false;
		
		var queryOptions = {};
		if(fields) {
			queryOptions.fields = fields;
		}
		if(sort) {
			queryOptions.sort = sort;
		}

		filter.owner = this.userId;
		return Events.find(filter, queryOptions);
	}

	this.ready();
	return;
});