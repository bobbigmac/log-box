LayoutComponent = React.createClass({
	brand: BrandName,
  render() {
		return (
			<div>
				<NavComponent brand={this.brand} />
				<div className="container-fluid">
				  <div className="row">
				    <div className="col-sm-12">
				    	{this.props.yield}
				    </div>
				  </div>
				</div>
			</div>
		)
  }
});