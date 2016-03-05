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
      detail: false 
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
			this.setState({ 'loading': false });
		}.bind(this));
	},
	toggleDetail() {
		this.setState({ detail: !this.state.detail });
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
						<a className="btn btn-link" onClick={this.toggleDetail}>
							<h4>
								<i className={"glyphicon glyphicon-menu-"+(this.state.detail ? 'down' : 'right')}></i>
								&nbsp;
								<span>Product Settings</span>
							</h4>
						</a>
					</div>
				</div>
				{this.state.detail && <div className="row">
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
				</div>}
			</section>
		);
	}
});