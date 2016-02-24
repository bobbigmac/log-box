NavComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    //var handle = Meteor.subscribe("interests", this.props.id);

    return {
      basicUser: Roles.userIsInRole(Meteor.userId(), ['basic']),
    };
  },
	render() {
		return (
			<nav className="navbar navbar-default navbar-static-top">
				<div className="container">
					
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed pull-left" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="glyphicon glyphicon-menu-hamburger"></span>
						</button>
						<a className="navbar-brand" href="/">{this.props.brand}</a>
					</div>

					<div id="navbar" className="navbar-collapse collapse">
						<ul className="nav navbar-nav">
							<li><a href="https://github.com/bobbigmac/log-box">Github</a></li>
						</ul>
						<AccountsUIWrapper className="nav navbar-nav navbar-right" />
					</div>
				</div>
			</nav>
		)
	}
});