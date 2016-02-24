
Meteor.publish("eventsGroups", function(filter) {
	ReactiveAggregate(this, Events, [{
		$match: {
			"created": { $type: 9 },
			"owner": this.userId
		}
	}, {
		$group: {
			'_id': {
        "year": { "$year": "$created" },
        "day": { "$dayOfYear": "$created" },
        "hour": { "$hour": "$created" }
      },
			'count': { $sum: 1 },
			'rand_id': { $first: "$_id" }
			//TODO: 'keys': { $sum: 1 },
		}
	}, {
		$project: {
			_id: "$rand_id",
			date: '$_id',
			count: '$count'
		}
	}], {
		observeSelector: {
			"owner": this.userId
		},
		// Send the aggregation to the 'clientReport' collection available for client use
		clientCollection: "events-groups"
	});
});