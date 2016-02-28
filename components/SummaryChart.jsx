const makeDate = function(date) {
	return ((date && new Date(date.year || 2010, date.month - 1 || 1, date.day || 1, date.hour || 0, date.minute || 0, date.second || 0)) || new Date());
}
const addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
const addHours = function(date, hours) {
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
				periods: EventsGroups.find().fetch(),
				//TODO: currentHour (reactively update this?)
			};
		} else {
			return {};
		}
	},
	componentWillUpdate(nextProps) {
		if(this.data && this.data.periods) {
			let handledLast = false
			const periods = this.data.periods.sort((a, b) => a.first > b.first ? 1 : -1);

			const both = periods.reduce(function(both, p, pos) {
				const date = p.date && makeDate(p.date);

				both[0].push(date);
				both[1].push(p.count);

				if((periods[pos+1] && periods[pos+1].date) || !handledLast) {
					let nextDate = false;
					if(periods[pos+1]) {
						nextDate = makeDate(periods[pos+1].date);
					} else {
						handledLast = nextDate = new Date();

						nextDate.setMinutes(0);
						nextDate.setSeconds(0);
						nextDate = addHours(nextDate, 1);
					}

					const hoursDiff = ((nextDate - date) / 36e5) - 1;//(60*60*1000);
					//console.log(hoursDiff, nextDate, date);
					
					for(var i = 0; i < hoursDiff; i++) {
						let newDate = addHours(date, i+1);
						both[0].push(newDate);
						if(!(newDate.getTime() > (new Date().getTime() - 36e5))) {
							both[1].push(0);
						}
					}
				}
				return both;
			}, [['x'], ['count']]);

			chart.load({
				columns: both
			});
		}
	},
	componentDidMount() {
		// See http://c3js.org/reference.html
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
						format: '%d/%Hh',
      			fit: true,
						rotate: 40,
					}
				},
				y: {
					tick: {
						min: 0
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