
Meteor.publish('interest', function(id) {
	return Interests.find(id);
});

Meteor.publish('interests', function(filter) {
	//TODO: Do something with filter
	return Interests.find({});
});