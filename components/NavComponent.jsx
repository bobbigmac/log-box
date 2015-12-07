NavComponent = React.createClass({
	render() {
		return (
			<nav className="navbar navbar-default navbar-static-top">
				<div className="container">
					
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href="/">{this.props.brand}</a>
					</div>

					<div id="navbar" className="navbar-collapse collapse">
						<ul className="nav navbar-nav"> {
							//<a href="#">Some link</a>
						}
						</ul>
						<AccountsUIWrapper className="nav navbar-nav navbar-right" />
					</div>
				</div>
			</nav>
		)
	}
});