Product = React.createClass({
	getInitialState() {
	    return {
	        detail: false  
	    };
	},
  addTestRecord(productId) {
  	Meteor.call('add-test', productId);
  },
  setProductName(event) {
  	let val = (event && event.target && event.target.value);
  	val = val && (''+val).trim();
		const product = this.props.product || {};

  	if(val && product._id) {
	  	Products.update(product._id, {
	  		$set: {
	  			name: val
	  		}
	  	});
	  	return true;
	  }
  },
	render() {
		const product = this.props.product || {};

		return (
			<section className="masonry-brick product-group">
				<div className="alert alert-info" role="alert">
					<button className="btn btn-default pull-right hidden" onClick={this.addTestRecord.bind(this, product._id)}>Add Test Record</button>
					<div className="pull-right">Owner: {product.apikey}</div>
					<ContentEditable className="bold-text" onChange={this.setProductName} html={product.name} />
				</div>

				{Meteor.isClient && <SummaryChart product={product._id} />}

				<ProductSettings product={product._id} />
			</section>
		)
	}
});