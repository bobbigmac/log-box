var React = require('react');

// https://atmospherejs.com/kadira/flow-router

// if(Meteor.isServer) {
//   FlowRouter.setDeferScriptLoading(true);
// }

FlowRouter.notFound = {
	action: function(params, queryParams) {
		FlowRouter.go('/');
	}
};

FlowRouter.route('/', {
	name: "home",
	action: function(params, queryParams) {
		ReactLayout.render(LayoutComponent, { yield: <HomeComponent /> });
	}
});