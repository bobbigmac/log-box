//TODO: Publish some collections

/*

Meteor.publish('games', function(param1, param2) {
	if(!this.userId) {
		//anonymous user
		return Games.find({ 'public': true });
	}
	else if(Roles.userIsInRole(this.userId, ['basic', 'admin']) && _id) {
		return Games.find({ 
			'$or': [
				{ 'public': true }, 
				{ owner: this.userId }
			]
		});
	}
	this.stop();
	return;
});

*/