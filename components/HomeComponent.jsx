HomeComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    Meteor.subscribe("apikey");
    //Meteor.subscribe("eventsGroups");
    var handle = Meteor.subscribe("events", {
    	sort: { created: -1 }
    });

    return {
    	user: Meteor.user(),
      events: Events.find({}, { sort: { created: -1 }}).fetch(),
      eventCount: Meteor.isClient ? EventsGroups.find().fetch().reduce((prev, eg) => prev+eg.count, 0) : false
    };
  },
  addTestRecord() {
  	Meteor.call('add-test');
  },
  render() {
		return (
			<section>
				{((!this.data.user) && <RegisterWarning show={!this.data.user} message="You must register to register log events and view realtime messages" />)}
				
				{((this.data.user) && 
					<div className="alert alert-info" role="alert">
						<span>GET, PUT or POST events to /add with any fields, including {"{"} owner: {this.data.user.apikey} {"}"}</span>
					</div> )}

				<h3 className="title">
					{((this.data.user) && 
						<button className="btn btn-default pull-right" onClick={this.addTestRecord}>Add Test Record</button>
					)}
					{(this.data.events && this.data.events.length||0)+"/"+(this.data && this.data.eventCount||0)+' Events'}
				</h3>

				{Meteor.isClient && <SummaryChart />}

				{this.data.events.map(function(item, i) {
					//console.log(item);
					return (
						<h3 key={item._id}>
							{(item.created && <span className="pull-right">{new moment(new Date(item.created)).fromNow()}</span>)}
							<a href={FlowHelpers.pathFor('edit-event', { id: item._id })}>{item.title}</a>
						</h3>
					);
				}, this)}

	      <DocumentTitle title={(this.data.events && this.data.events.length||0)+' Events - '+BrandName} />
			</section>
		);
  }
});