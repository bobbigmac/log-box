
Meteor.publish("eventsGroups", function(timeLimitDays, model) {
	timeLimitDays = (typeof timeLimitDays == 'number' && timeLimitDays) || 2;
	model = model instanceof Object && model || {
		'level': [
			['fatal', 1],
			['error', 1],
			['warning', 1],
			['info', 1],
			['success', 1],//"$processed"
			['debug', 1],
		]
	}

	var result = new Date();
	var timeLimit = result.setDate(result.getDate() - timeLimitDays);

	// group fields
	var group = {
		'_id': {
			"product": "$product",
		  "year": { "$year": "$created" },
		  "month": { "$month": "$created" },
		  "day": { "$dayOfMonth": "$created" },
		  "hour": { "$hour": "$created" }
		},
		'created': { "$first": "$created" },
		'rand_id': { $first: "$_id" },
		'count': { $sum: 1 }
	};

	for(var key in model) {
		if(model[key] instanceof Array) {
			model[key].forEach(function(pair) {
				if(!group[pair[0]]) {
					group[pair[0]] = {
						$sum: {
							$cond: { 
								if: { $eq: ['$'+key, pair[0]] }, 
								then: (pair[1] || 1), 
								else: (pair[2] || 0)
							}
						}
					};
				}
			});
		}
	}

	// project fields
	var project = {
		_id: "$rand_id",
		date: '$_id',
		first: '$created',
		count: '$count'
	};

	for(var key in model) {
		if(model[key] instanceof Array) {
			model[key].forEach(function(pair) {
				if(!project[pair[0]]) {
					project[pair[0]] = '$'+pair[0];
				}
			});
		}
	}

	ReactiveAggregate(this, Events, [{
		$match: {
			"created": { $type: 9 },
			"created": { $gte: new Date(timeLimit) },
			"product": { $exists: true },
			"owner": this.userId
		}
	}, {
		$group: group
	}, {
		$sort: {
			created: 1
		}
	}, {
		$project: project
	}], {
		observeSelector: {
			"owner": this.userId
		},
		// Send the aggregation to the 'clientReport' collection available for client use
		clientCollection: "events-groups"
	});
});