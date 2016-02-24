SummaryChart = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
  	if(Meteor.isClient) {
	    var handle = Meteor.subscribe("eventsGroups");

	    return {
	    	loading: !handle.ready(),
	    	user: Meteor.user(),
	      periods: EventsGroups.find().fetch()
	    };
	  } else {
	  	return {};
	  }
  },
  componentWillUpdate(nextProps) {
  	//TODO: Diff, or setup client-side observer and just watch added
  	console.log('will update', this.data);
  	if(this.data && this.data.periods) {
  		const graph = this.graph;
  		const periods = this.data.periods;
  		//console.log(graph);
  		let cache = this.cache;

  		periods.forEach(function(data, pos) {
  			let date = data.date;
  			if(date) {
  				date = new Date(date.year || 2010, date.month || 1, date.day || 1, date.hour || 0, date.minute || 0, 0);
					const cacheKey = 'x'+date.getTime();
  				//console.log(date, graph.series);
					
					//TODO: Currently doesn't update the latest entry if data has changed
  				if(!cache[cacheKey]) {
  					cache[cacheKey] = {
							date: date,
							count: data.count
						};
						graph.series.addData(cache[cacheKey]);
					} else {
						cache[cacheKey].count = data.count;
						//TODO: Clear out magic numbers, do this right
						graphData = graph.series[1].data;
						console.log('graph.series', graph.series, graphData[graphData.length-1]);
						graphData[graphData.length-1].y = data.count;
					}
				}
  		});
			
			this.xAxis.render();
			graph.render();
  	}
  },
  componentDidMount() {
  	// console.log('did mount', this.data, this.refs['chart-container']);
		var time = new Rickshaw.Fixtures.Time();

  	this.cache = {};
  	// See http://code.shutterstock.com/rickshaw/
		let graph = this.graph = new Rickshaw.Graph({
			element: this.refs['chart-container'],
			width: 900,
			height: 300,
			renderer: 'line',
			interpolation: 'linear',
			/*series: new Rickshaw.Series.FixedDuration([{ name: 'date' }], undefined, {
				timeInterval: 60 * 60 * 1000,
				maxDataPoints: 24,
				timeBase: (2 * 24 * 60 * 60)
			})*/
			series: new Rickshaw.Series.FixedDuration([{ name: 'date' }], [], {
				timeInterval: 60,
				maxDataPoints: 20
			})
		});

		var xAxis = this.xAxis = new Rickshaw.Graph.Axis.Time({
	    graph: graph,
	    timeUnit: time.unit('hour'),
		});

		Meteor.setInterval(function() {
			graph.render();
			xAxis.render();
		}, 10 * 1000);
  },
  render() {
		return (
			<section>
				<div ref="chart-container">
				</div>
				<div ref="table-container">
					<Table cols={['Year', 'Month', 'Day', 'Hour', 'Events']}>
						{this.data && this.data.periods.map(function(period) {
							return (
								<tr key={period._id}>
									<td>{period.date.year}</td>
									<td>{period.date.month}</td>
									<td>{period.date.day}</td>
									<td>{period.date.hour}</td>
									<td>{period.count}</td>
								</tr>
							)
						})}
					</Table>
				</div>
			</section>
		);
  }
});