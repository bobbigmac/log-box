// https://atmospherejs.com/kadira/flow-router

if(Meteor.isServer) {
  FlowRouter.setDeferScriptLoading(true);
}

FlowRouter.notFound = {
	action: function(params, queryParams) {
		FlowRouter.go('/');
	}
};

FlowRouter.route('/', {
	name: "home",
	action: function(params, queryParams) {
		//TODO: Pull whatever parameters you want from the query, and render a component
		var name = queryParams.name || 'World';

		ReactLayout.render(LayoutComponent, { yield: <HomeComponent name={name} /> });
	}
});