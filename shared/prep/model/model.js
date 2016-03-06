BrandName = 'Log Jar';

Products = new Mongo.Collection('products');
Events = new Mongo.Collection('events');

//Used to consolidate Events keys
ProductKeys = new Mongo.Collection('ProductKeys');

if(Meteor.isServer) {
	if(typeof Session == 'undefined') {
		Session = {
			get: function() {
				return undefined;
			},
			set: function() {
				return undefined;
			},
			setDefault: function() {
				return undefined;
			}
		}
	}
}

Session.setDefault('masonryCap', 1);