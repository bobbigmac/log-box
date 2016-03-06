Meteor.startup(function () {  
  Events._ensureIndex({ 'owner': 1, 'product': 1 });
  Events._ensureIndex({ 'created': 1 });
  Events._ensureIndex({ 'level': 1 });
  //Products._ensureIndex({ 'created': 1 });
});

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
	'delete-events': function(productApiKey, selector) {
		if(this.userId && productApiKey && selector && selector instanceof Object) {

			var product = Products.findOne({
				apikey: productApiKey,
				owner: this.userId
			}, { fields: { _id: 1 }});

			if(product) {
				selector.owner = this.userId;
				selector.product = product._id;

				Events.remove(selector);
			}
		}
	},
	'move-events': function(productApiKey, selector, toProductApiKey) {
		//console.log(this.userId, productApiKey, selector, toProductApiKey, selector instanceof Object);
		if(this.userId && productApiKey && toProductApiKey && selector && selector instanceof Object) {

			var product = Products.findOne({
				apikey: productApiKey,
				owner: this.userId
			}, { fields: { _id: 1 }});

			//console.log('product', product);
			if(product) {

				selector.owner = this.userId;
				selector.product = product._id;

				var toProduct = Products.findOne({
					apikey: toProductApiKey,
					owner: this.userId
				});

				//console.log('toProduct', toProduct, selector);
				if(toProduct) {
					Events.update(selector, {
						$set: {
							product: toProduct._id
						}
					}, { multi: true });
				}
			}
		}
	},
	'calculate-product-commons': function(productId) {
		if(productId && this.userId) {

			// Get a large number of recently logged events
			const events = Events.find({
				owner: this.userId,
				product: productId
			}, { limit: 1000, sort: { created: -1 }, fields: { _id: false, created: false, owner: false, product: false }}).fetch();

			if(events && events.length) {
				// Get object of keys common to all events
				const commons = events.reduce(function(c, e) {
					return Object.keys(c || e).reduce(function(comps, k) {

						// Consolidate to object with counts of each non-object value
						if((!c || (c[k] != undefined && e[k] != undefined))) {
							// Value must be a string or number to group on
							if((typeof e[k] === 'string' && e[k].lastIndexOf('.') === -1 && e[k].lastIndexOf('$') === -1) || typeof e[k] === 'number') {
								comps[k] = comps[k] || (c && c[k]) || {};
								comps[k][e[k]] = comps[k][e[k]] || 0;
								comps[k][e[k]]++;
							}
						}
						return comps;
					}, {});
				}, false);//Start from nothing (first object will provide initial keyset)

				for(var k in commons) {
					commons[k] = Object.keys(commons[k]).map(function(x) {
						return { v: x, c: commons[k][x] };
					});
					//TODO: Have a limit of groupable (chart legend entries)
					if(commons[k].length > 20) {
						delete commons[k];
					}
				}

				Products.update(productId, {
					$set: {
						commons: commons
					}
				});
			}
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