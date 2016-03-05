ProductSettings = React.createClass({
  mixins: [ReactMeteorData],
	getMeteorData() {
		const user = Meteor.user();
    const profile = (user && user.profile) || {};
    const product = Products.findOne(this.props.product);
    const settings = (product && product.settings) || {};
    const commons = (product && product.commons);

    return {
    	user: user,
      profile: profile,
      product: product,
      settings: settings,
      commons: commons
    };
	},
	getInitialState() {
    return {
      loading: false,  
    };
	},
	updateSetting(key, val) {
		if(key && val && this.props.product) {
			Products.update(this.props.product, {
				$set: {
					['settings.'+key]: val
				}
			});
		}
	},
	calculateCommons() {
		this.setState({ 'loading': true });

		Meteor.call('calculate-product-commons', this.props.product, function() {
			console.log('calculating commons');
			this.setState({ 'loading': false });
		}.bind(this));
	},
	render() {
		if(!this.data.commons) {
			return (<div className="alert alert-warning">
				{(
					(this.state.loading && 'Calculating Common Fields') ||
					<div>
						<button className="btn btn-default pull-right" onClick={this.calculateCommons}>Calculate Common Fields</button>
						<span>Log some events for this product to enable configuration.</span>
					</div>
				)}
			</div>);
		};

		return (
			<section className="product-settings-container">
				<div className="row">
					<div className="col-xs-12">
						<h4>Product Settings <small>(placeholder)</small></h4>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">
						{!this.state.loading && <button className="btn btn-default pull-right" onClick={this.calculateCommons}>Recalculate Common Fields</button>}
						<strong>Common Fields: </strong>
						{!Object.keys(this.data.commons).length && 'No common fields for all events'}
						{Object.keys(this.data.commons).map(function(c) {
							return (<div key={c}><strong>{c}</strong>: {
								this.data.commons[c].map(function(x) {
									return (<span className="common-field-value" key={x.v}>{x.v}: {x.c}</span>)
								}.bind(this))
							}
							</div>);
						}.bind(this))}
					</div>
				</div>
			</section>
		);
	}
});