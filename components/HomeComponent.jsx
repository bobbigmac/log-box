HomeComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    //Meteor.subscribe("apikey");
    const StartDate = typeof Session != 'undefined' && Session.get('viewedStartDate');
    const EndDate = typeof Session != 'undefined' && Session.get('viewedEndDate');

    Meteor.subscribe("products");

    var sub = {
    	sort: { created: -1 }
    };
    if(StartDate && EndDate) {
    	sub.filter = { created: { $gte: StartDate, $lte: EndDate }};
    }
    var handle = Meteor.subscribe("events", sub);

    return {
    	user: Meteor.user(),
      events: Events.find({}, { sort: { created: -1 }}).fetch(),
      products: Products.find().fetch(),
      eventCount: (Meteor.isClient ? EventsGroups.find().fetch().reduce((prev, eg) => prev+eg.count, 0) : false),
      capSize: ((typeof Session != 'undefined' && Session.get('masonryCap')) || 2)
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

		const capSize = this.data && this.data.capSize;

		return (
			<section>
				<div className={"masonry-wall masonry-cap-"+capSize}>
					{this.data.products.map(function(product) {
						return (
							<section className="masonry-brick product-group" key={product._id}>
								<div className="alert alert-info" role="alert">
									<button className="btn btn-default pull-right hidden" onClick={this.addTestRecord.bind(this, product._id)}>Add Test Record</button>
									<div className="pull-right">Owner: {product.apikey}</div>
									<div><strong>{product.name}</strong></div>
								</div>

								{Meteor.isClient && <SummaryChart product={product._id} />}
							</section>
						)
					}.bind(this))}
				</div>

				<h3 className="title">
					<button className="btn btn-default pull-right" onClick={this.addProduct}>Add Product</button>
					{(this.data.events && this.data.events.length||0)+"/"+(this.data && this.data.eventCount||0)+' Events'}
				</h3>

				{this.data.events.map(function(item, i) {
					return (
						<Event event={item} key={item._id} />
					);
				}.bind(this))}

	      <DocumentTitle title={(this.data.events.length||0)+'/'+(this.data.eventCount||0)+' Events - '+BrandName} />
			</section>
		);
  }
});