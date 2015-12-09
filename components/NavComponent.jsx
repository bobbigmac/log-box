NavComponent = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    //var handle = Meteor.subscribe("interests", this.props.id);

    return {
      basicUser: Roles.userIsInRole(Meteor.userId(), ['basic']),
    };
  },
	render() {
		var addLink = (this.data.basicUser ? <li><a href={FlowHelpers.pathFor('add-interest')}>Add New</a></li> : '');

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
						<ul className="nav navbar-nav">
							{addLink}
						</ul>
						<AccountsUIWrapper className="nav navbar-nav navbar-right" />
					</div>
				</div>
			</nav>
		)
	}
});