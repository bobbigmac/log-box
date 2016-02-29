
Meteor.startup(function () {
	if(typeof AccountsGuest !== 'undefined') {
		AccountsGuest.name = true;
	}
});

Meteor.methods({
	'add-test': function() {
		Events.insert({
			owner: this.userId,
			level: 'info',
			type: 'test',
			title: 'test '+Random.id(),
			created: new Date(),
			modified: new Date(),
		});
	}
});