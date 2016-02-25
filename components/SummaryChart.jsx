var graph = false;
var xAxis = false;
var cache = {};

var makeDate = function(date) {
	return new Date(date.year || 2010, date.month || 1, date.day || 1, date.hour || 0, date.minute || 0, date.second || 0);
}
var addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
var addHours = function(date, hours) {
    var result = new Date(date);
    result.setTime(result.getTime() + (hours*60*60*1000));
    return result;
}

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
  	//console.log('will update', this.data);
  	if(this.data && this.data.periods) {
  		var periods = this.data.periods;

  		if(periods && periods.length) {
	  		// var startDate = periods[0].date;
	  		// var endDate = periods[periods.length - 1].date;

	  		periods.forEach(function(data, pos) {
	  			let date = data.date;
	  			if(date) {
	  				date = makeDate(date);
						const cacheKey = 'x'+date.getTime();

	  				if(!cache[cacheKey]) {
	  					cache[cacheKey] = {
								date: date,
								count: data.count
							};
							graph.series.addData(cache[cacheKey]);

							if(periods[pos+1] && periods[pos+1].date) {
								var nextDate = makeDate(periods[pos+1].date);
								var hoursDiff = (Math.abs(nextDate - date) / 36e5) - 1;//(60*60*1000);
								//var plusOneDay = addDays(date, 1);

								console.log(date, nextDate, hoursDiff);
								for(var i = 0; i < hoursDiff; i++) {
									graph.series.addData({ date: addHours(date, i+1), count: 0 });
								}
							}
						} else {
							cache[cacheKey].count = data.count;
							//TODO: Clear out magic numbers, do this right
							if(graph.series && graph.series[1]) {
								graphData = graph.series[1].data;
								//console.log('graph.series', graph.series, graphData[graphData.length-1]);
								graphData[graphData.length-1].y = data.count;
							}
						}
					}
	  		});
				
				console.log(graph.series)
				graph.render();
				xAxis.render();
			}
  	}
  },
  componentDidMount() {
  	// console.log('did mount', this.data, this.refs['chart-container']);
		var time = new Rickshaw.Fixtures.Time();

  	cache = {};
  	// See http://code.shutterstock.com/rickshaw/
		graph = new Rickshaw.Graph({
			element: this.refs['chart-container'],
			width: 900,
			height: 300,
			renderer: 'line',
			interpolation: 'linear',
			series: new Rickshaw.Series.FixedDuration([{ name: 'date' }], [], {
				timeInterval: 60*60*1000,
				maxDataPoints: 96,
				//timeBase: (2 * 24 * 60 * 60 * 1000)
			})
		});
		//var graph = this.graph;

		xAxis = new Rickshaw.Graph.Axis.Time({
	    graph: graph,
	    timeUnit: time.unit('day'),
		});
		//xAxis = this.xAxis;

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