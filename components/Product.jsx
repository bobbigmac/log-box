Product = React.createClass({
	getInitialState() {
	    return {
	        detail: false  
	    };
	},
  addTestRecord(productId) {
  	Meteor.call('add-test', productId);
  },
	render() {
		var product = this.props.product || {};

		return (
			<section className="masonry-brick product-group">
				<div className="alert alert-info" role="alert">
					<button className="btn btn-default pull-right hidden" onClick={this.addTestRecord.bind(this, product._id)}>Add Test Record</button>
					<div className="pull-right">Owner: {product.apikey}</div>
					<div><strong>{product.name}</strong></div>
				</div>

				{Meteor.isClient && <SummaryChart product={product._id} />}

				<ProductSettings product={product._id} />
			</section>
		)
	}
});