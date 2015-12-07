LayoutComponent = React.createClass({
	brand: 'Simple Boilerplate',
  render() {
		return (
			<div>
				<NavComponent brand={this.brand} />
				<div className="container">
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