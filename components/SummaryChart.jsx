const makeDate = function(date) {
	return ((date && new Date(date.year || 2010, date.month || 1, date.day || 1, date.hour || 0, date.minute || 0, date.second || 0)) || new Date());
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
		if(this.data && this.data.periods) {
			const both = this.data.periods.reduce(function(both, p) {

				both[0].push(makeDate(p.date));
				both[1].push(p.count);

				//TODO: Adapt this if wanting to interpolate ticks
				// if(periods[pos+1] && periods[pos+1].date) {
				// 	var nextDate = makeDate(periods[pos+1].date);
				// 	var hoursDiff = (Math.abs(nextDate - date) / 36e5) - 1;//(60*60*1000);
				// 	//var plusOneDay = addDays(date, 1);

				// 	console.log(date, nextDate, hoursDiff);
				// 	for(var i = 0; i < hoursDiff; i++) {
				// 		graph.series.addData({ date: addHours(date, i+1), count: 0 });
				// 	}
				// }
				return both;
			}, [['x'], ['count']]);

			chart.load({
				columns: both
			});
		}
	},
	componentDidMount() {
		chart = c3.generate({
			bindto: this.refs['chart-container'],
			data: {
				x: 'x',
				//xFormat: '%Y-%m-%d %H:%M:%S',
				columns: [
					['x'],
					['count']
				]
			},
			axis: {
				x: {
					type: 'timeseries',
					tick: {
						format: '%d/%H',
            // format: function (x) {
            //   if(x.getHours() === 0) {
            //     return x;
            //   }
            // },
						rotate: 40,
					}
				}
			}
		});

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