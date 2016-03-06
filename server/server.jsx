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
	//TODO: System-wide alternative to calculate-product-commons, pushing the load onto mongo (won't need to pull into server memory)
	'get-product-keys': function() {
		var userId = this.userId;

		var map = function() {
			var ev = this;
			var blackListKeys = {
				_id: true,
				owner: true,
				product: true,
			};

			emit(ev.product, Object.keys(ev).filter(key => !blackListKeys[key]).map(function(key) {
				return { key: key, value: ev[key] };
			}));
		};

		var reduce = function(key, stuffs) {
			var keys = stuffs.reduce(function(pre, stuff) {

				Object.keys(stuff).map(function(key) {
					var curr = stuff[key];
					if(typeof curr.value == 'string' && curr.value.lastIndexOf('.') === -1 && curr.value.lastIndexOf('$') === -1) {
						pre[curr.key] = pre[curr.key] || {};
						pre[curr.key][curr.value] = pre[curr.key][curr.value] || 0;
						pre[curr.key][curr.value]++;
					}
				});

				return pre
			}, {});

			return keys;
		};

		var options = { query: {}, out: "ProductKeys", verbose: false };

		var db = Events.find()._mongo.db.collection('events');
		db.mapReduce(map, reduce, options, function(err, result, stats) {
			if(err) {
				console.log('error', err);
			}
		});

		// Meteor.setTimeout(function() {
		// 	console.log(JSON.stringify(ProductKeys.find("r9XWLecQPwb9kRfQs").fetch()));
		// }, 1000);
	},
	'calculate-product-commons': function(productId) {
		if(productId && this.userId) {

			// Get a large number of recently logged events
			const events = Events.find({
				owner: this.userId,
				product: productId
			}, { limit: 5000, sort: { created: -1 }, fields: { _id: false, created: false, owner: false, product: false }}).fetch();

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