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
						{Object.keys(this.data.commons).map(function(c) {
							return (<div>{c}</div>);
						})}
					</div>
				</div>
			</section>
		);
	}
});