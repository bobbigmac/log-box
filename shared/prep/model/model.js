BrandName = 'Log Jar';

Products = new Mongo.Collection('products');
Events = new Mongo.Collection('events');

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