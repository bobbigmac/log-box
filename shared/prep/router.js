Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  layoutTemplate: 'layout'
});

var currentUser = {
  ready: function() {
    var user = Meteor.user();
    return (user === null || typeof user !== "undefined");
  }
};

Router.route('/', {
	name: 'home',
	waitOn: function () {
		//return [
		//	currentUser,
		//	Meteor.subscribe('games')
		//];
	},
	data: function() {
		//var links = Links.find();
		//Session.set('page-title', links.count()+' links');
	}
});

//TODO: Add routes here