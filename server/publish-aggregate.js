
Meteor.publish("eventsGroups", function(filter) {

	var result = new Date();
	var timeLimit = result.setDate(result.getDate() - 4);
	//console.log('timeLimit', timeLimit, new Date(timeLimit));

	ReactiveAggregate(this, Events, [{
		$match: {
			"created": { $type: 9 },
			"created": { $gt: new Date(timeLimit) },
			"owner": this.userId
		}
	}, {
		$group: {
			'_id': {
        "year": { "$year": "$created" },
        "month": { "$month": "$created" },
        "day": { "$dayOfMonth": "$created" },
        "hour": { "$hour": "$created" },
        //"minute": { "$minute": "$created" }
      },
      'created': { "$first": "$created" },
			'count': { $sum: 1 },
			'rand_id': { $first: "$_id" },
			'error': { $sum: { $cond: { if: { $eq: ['$level', 'error'] }, then: 1, else: 0 }}},
			'warning': { $sum: { $cond: { if: { $eq: ['$level', 'warning'] }, then: 1, else: 0 }}},
			'info': { $sum: { $cond: { if: { $eq: ['$level', 'info'] }, then: 1, else: 0 }}},
			'success': { $sum: { $cond: { if: { $eq: ['$level', 'success'] }, then: 1, else: 0 }}},
			//TODO: 'keys': { $sum: 1 },
		}
	}, {
		$sort: {
			created: 1
		}
	}, {
		$project: {
			_id: "$rand_id",
			date: '$_id',
			first: '$created',
			count: '$count',
			error: '$error',
			warning: '$warning',
			info: '$info',
			success: '$success',
		}
	}], {
		observeSelector: {
			"owner": this.userId
		},
		// Send the aggregation to the 'clientReport' collection available for client use
		clientCollection: "events-groups"
	});
});