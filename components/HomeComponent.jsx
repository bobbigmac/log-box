HomeComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    //Meteor.subscribe("apikey");
    const StartDate = Session.get('viewedStartDate');
    const EndDate = Session.get('viewedEndDate');
    const viewProductId = Session.get('viewedProduct');

    Meteor.subscribe("products");

    var sub = {
    	sort: { created: -1 },
    	filter: {}
    };
    if(StartDate && EndDate) {
    	sub.filter.created = { $gte: StartDate, $lte: EndDate };
    } else {
    	sub.filter.level = { $in: ['fatal', 'error', 'warning'] };
    }
    if(viewProductId) {
      sub.filter.product = viewProductId;
    }
    var handle = Meteor.subscribe("events", sub);

    var user = Meteor.user();
    var profile = ((user && user.profile) || {});

    var capSize = profile.masonryCap || Session.get('masonryCap');
    if(!capSize) {
    	capSize = 2;
    	Session.set('masonryCap', capSize);
    }

    var viewedProduct = viewProductId && Products.findOne(viewProductId);
    return {
    	user: user,
      events: Events.find({}, { sort: { created: -1 }}).fetch(),
      products: Products.find().fetch(),
      eventCount: (Meteor.isClient ? EventsGroups.find().fetch().reduce((prev, eg) => prev+eg.count, 0) : false),
      capSize: capSize,
      viewedProduct: viewedProduct
    };
  },
  addProduct() {
  	Meteor.call('add-product');
  },
  render() {
  	if(!this.data.user) {
			return (<RegisterWarning show={!this.data.user} message="You must register to register log events and view realtime messages" />)
  	};

		let capSize = this.data && this.data.capSize;
		capSize = (capSize > this.data.products.length ? this.data.products.length : capSize);

		return (
			<section>

				<div className="row">
					<div className="col-xs-12">
						<div className={"masonry-wall masonry-cap-"+capSize}>
							{this.data.products.map(function(product) {
								return (
									<Product product={product} key={product._id} />
								)
							}.bind(this))}
						</div>
					</div>
				</div>
        
        <UserSettings />

				<div className="container">
					<div className="row">
						<div className="col-xs-12">

							<h3 className="title">
								<button className="btn btn-default pull-right" onClick={this.addProduct}>Add Product</button>
								{(this.data.events && this.data.events.length||0)+"/"+(this.data && this.data.eventCount||0)+' Events'+(this.data.viewedProduct ? ' on ' + this.data.viewedProduct.name : '')}
							</h3>

							{this.data.events.map(function(item, i) {
								return (
									<Event event={item} key={item._id} />
								);
							}.bind(this))}

						</div>
					</div>
				</div>

	      <DocumentTitle title={(this.data.events.length||0)+'/'+(this.data.eventCount||0)+' Events - '+BrandName} />
			</section>
		);
  }
});