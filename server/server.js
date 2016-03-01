
Meteor.startup(function () {
	if(typeof AccountsGuest !== 'undefined') {
		AccountsGuest.name = true;
	}

	// Port any old user's apiKey to a Product
	Meteor.users.find({
		apikey: { $exists: true },
	}).forEach(function(user) {

		// Add a product for the user
		Products.insert({
	  	owner: user._id,
	  	apikey: user.apikey,
	  	name: 'Default Product Name',
	  	created: (new Date())
	  }, function(error, productId) {
	  	console.log('Inserted product for', user._id, 'with apikey', user.apikey, productId || error);
	  });
	  
	  // Unset the user's apiKey
	  Meteor.users.update(user._id, {
	  	$unset: {
	  		apikey: ""
	  	}
	  }, function(error, affected) {
	  	console.log('Updated user to unset apiKey for', user._id, affected || error);
	  });
	});
});

Meteor.methods({
	'add-test': function(productId) {
		if(this.userId) {
			Events.insert({
				owner: this.userId,
				product: productId,
				level: 'info',
				type: 'test',
				title: 'test '+Random.id(),
				created: new Date(),
				modified: new Date(),
			});
		}
	},
	'add-product': function() {
		if(this.userId) {
			Products.insert({
				owner: this.userId,
				apikey: Random.id().toLowerCase(),
				name: 'New Product',
				created: new Date(),
				modified: new Date(),
			});
		}
	}
});