Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  layoutTemplate: 'layout'
});

Router.route('/', {
	name: 'home',
	waitOn: function () {
		//return Meteor.subscribe('games');
	}
});

//TODO: Add routes here