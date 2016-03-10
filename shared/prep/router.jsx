// https://atmospherejs.com/kadira/flow-router

// if(Meteor.isServer) {
//   FlowRouter.setDeferScriptLoading(true);
// }

FlowRouter.notFound = {
	action: function(params, queryParams) {
		FlowRouter.go('/');
	}
};

/*FlowRouter.route('/add', {
	name: "add-interest",
	action: function(params, queryParams) {
		ReactLayout.render(LayoutComponent, { yield: <EditInterestComponent /> });
	}
});

FlowRouter.route('/edit/:id', {
	name: "edit-interest",
	action: function(params, queryParams) {
		// var interest = Interests.findOne({ _id: params.id });

		ReactLayout.render(LayoutComponent, { yield: <EditInterestComponent id={params.id} /> });
	}
});*/

/*if(Meteor.isServer) {
	FlowRouter.route('/add', {
		name: 'add',
		action: function(params, queryParams, res, req) {
			console.log(params, queryParams, res, req)
			return 'hello';
		}
	});
}*/

FlowRouter.route('/', {
	name: "home",
	action: function(params, queryParams) {
		//TODO: Pull whatever parameters you want from the query, and render a component
		var name = queryParams.name || 'World';

		ReactLayout.render(LayoutComponent, { yield: <HomeComponent name={name} /> });
	}
});