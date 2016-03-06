SummaryTable = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData() {

		//DO NOT USE, OUT OF DATE
		
		if(Meteor.isClient) {
			var handle = Meteor.subscribe("eventsGroups");

			return {
				loading: !handle.ready(),
				user: Meteor.user(),
				periods: EventsGroups.find().fetch(),
				currentTime: Session.get('current-time')
			};
		} else {
			return {};
		}
	},
	render() {
		const currentDay = (new Date()).getDay();
		console.log(currentDay);
		return (
			<section>
				<div ref="table-container">
					<Table cols={['Year', 'Month', 'Day', 'Hour', 'Events', 'Error', 'Warning', 'Info', 'Success', 'Fatal', 'Debug']}>
						{this.data && this.data.periods.filter((p) => p.date.day == currentDay).map(function(period) {
							return (
								<tr key={period._id}>
									<td>{period.date.year}</td>
									<td>{period.date.month}</td>
									<td>{period.date.day}</td>
									<td>{period.date.hour}</td>
									<td>{period.count}</td>
									<td>{period.error}</td>
									<td>{period.warning}</td>
									<td>{period.info}</td>
									<td>{period.success}</td>
									<td>{period.fatal}</td>
									<td>{period.debug}</td>
								</tr>
							)
						})}
					</Table>
				</div>
			</section>
		);
	}
});