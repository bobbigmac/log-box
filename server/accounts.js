Meteor.startup(function() {
	//Add any extra roles
	var roles = ['basic', 'admin'];

	if(Meteor.roles.find().count() != roles.length) {
		roles.map(function(role) {
			Roles.createRole(role);
		});
	}
});

Accounts.onCreateUser(function(options, user) {
  user.roles = ['basic'];
  
  //user.apikey = Random.id().toLowerCase();
  console.log('creating a default product for new user', user._id, user, options);
  Products.insert({
  	owner: user._id,
  	apikey: Random.id().toLowerCase(),
  	name: 'Default Product Name',
  	created: (new Date()) 
  })

	if(options.profile) {
		user.profile = options.profile;
	};
    
	var email = (user && user.emails && typeof(user.emails) === 'object' && user.emails instanceof Array && user.emails[0] && user.emails[0].address);
	if(user && email) {
		//Do any additional profile work
	}

	return user;
});