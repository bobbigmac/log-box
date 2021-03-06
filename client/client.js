Meteor.startup(function () {
	sAlert.config({
		effect: 'flip',
		position: 'bottom-left',
		timeout: 5000,
		html: false,
		onRouteClose: true,
		stack: true,
		// or you can pass an object: 
		// stack: { 
		//     spacing: 10 // in px 
		//     limit: 3 // when fourth alert appears all previous ones are cleared 
		// } 
		offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config) 
		//beep: true,
		// examples: 
		// beep: '/beep.mp3'  // or you can pass an object: 
		/*beep: { 
	    info: '/beep-info.mp3', 
	    error: '/beep-error.mp3', 
	    success: '/beep-success.mp3', 
	    warning: '/beep-warning.mp3' 
		},*/
		onClose: _.noop // 
		// examples: 
		// onClose: function() { 
		//     /* Code here will be executed once the alert closes. */ 
		// } 
	});

	Events.find().observeChanges({
		added: function (id, fields) {
			var message = fields.message || fields.title || fields.text;

			if(fields.created && moment().diff(fields.created, 'minutes') < 5) {
				if(message && fields && (fields.level == 'fatal' || fields.level == 'error')) {
					sAlert.error(message);
				}
				if(message && fields && fields.level == 'warning') {
					sAlert.warning(message);
				}
				if(message && fields && fields.level == 'success') {
					sAlert.success(message);
				}
				if(message && fields && (fields.level == 'info' || fields.level == 'debug' || !fields.level)) {
					sAlert.info(message);
				}
			}
		}
	});
});