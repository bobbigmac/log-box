if(typeof Kadira != 'undefined') {
	var settings = Meteor.settings || {};
	if(settings.kadiraKey && settings.kadiraSecret) {
		Kadira.connect(settings.kadiraKey, settings.kadiraSecret);
	}
}