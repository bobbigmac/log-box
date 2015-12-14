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
			<section>
				<h3 className="title">{(this.data.interests && this.data.interests.length||0)+' Listings'}</h3>

				{this.data.interests.map(function(item, i) {
					return (
						<h3 key={item._id}>
							<a href={FlowHelpers.pathFor('edit-interest', { id: item._id })}>{item.title}</a>
						</h3>
					);
				}, this)}

	      <DocumentTitle title={(this.data.interests && this.data.interests.length||0)+' Listings - '+BrandName} />
			</section>
		);
  }
});