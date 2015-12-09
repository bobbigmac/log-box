HomeComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var handle = Meteor.subscribe("interests");

    return {
      interests: Interests.find().fetch()
    };
  },
  render() {
		return (
			<div>
				<h2 className="title">Hello {this.props.name}!</h2>
				{this.data.interests.map(function(item, i) {
					return (
						<div className="row" key={item._id}>
							<a href={FlowHelpers.pathFor('edit-interest', { id: item._id })}>{item.name}</a>
						</div>
					);
				}, this)}
			</div>
		);
  }
});