HomeComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    //Meteor.subscribe("apikey");
    Meteor.subscribe("products");
    var handle = Meteor.subscribe("events", {
    	sort: { created: -1 }
    });

    return {
    	user: Meteor.user(),
      events: Events.find({}, { sort: { created: -1 }}).fetch(),
      products: Products.find().fetch(),
      eventCount: (Meteor.isClient ? EventsGroups.find().fetch().reduce((prev, eg) => prev+eg.count, 0) : false)
    };
  },
  addTestRecord(productId) {
  	Meteor.call('add-test', productId);
  },
  addProduct() {
  	Meteor.call('add-product');
  },
  render() {
  	if(!this.data.user) {
			return (<RegisterWarning show={!this.data.user} message="You must register to register log events and view realtime messages" />)
  	};

		return (
			<section>
				{this.data.products.map(function(product) {
					return (
						<section className="product-group" key={product._id}>
							<div className="alert alert-info" role="alert">
								<button className="btn btn-default pull-right hidden" onClick={this.addTestRecord.bind(this, product._id)}>Add Test Record</button>
								<div className="pull-right">GET, PUT or POST events to /add with any fields, including {"{"} owner: {product.apikey} {"}"}</div>
								<div>Product: {product.name}</div>
							</div>

							{Meteor.isClient && <SummaryChart product={product._id} />}
						</section>
					)
				}.bind(this))}

				<h3 className="title">
					<button className="btn btn-default pull-right" onClick={this.addProduct}>Add Product</button>
					{(this.data.events && this.data.events.length||0)+"/"+(this.data && this.data.eventCount||0)+' Events'}
				</h3>

				{this.data.events.map(function(item, i) {
					return (
						<h3 key={item._id}>
							{(item.created && <span className="pull-right">{new moment(new Date(item.created)).fromNow()}</span>)}
							<a href={FlowHelpers.pathFor('edit-event', { id: item._id })}>{(item.title || item.message || item.messageTemplate)}</a>
						</h3>
					);
				}.bind(this))}

	      <DocumentTitle title={(this.data.events.length||0)+'/'+(this.data.eventCount||0)+' Events - '+BrandName} />
			</section>
		);
  }
});