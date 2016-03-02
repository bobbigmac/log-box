Event = React.createClass({
	getInitialState() {
	    return {
	        detail: false  
	    };
	},
	toggleDetail() {
		this.setState({ detail: !this.state.detail });
	},
	render() {
		const item = this.props.event;
		let detail = '';

		if(this.state.detail) {
			//See https://github.com/Lapple/react-json-inspector
			detail = <JsonInspector data={item} />
		}

		return (
			<div>
				<h3 className={"event-"+item.level}>
					{(item.created && <span className="pull-right">{new moment(new Date(item.created)).fromNow()}</span>)}
					<a className="event-title" onClick={this.toggleDetail}>
						{(item.title || item.message || item.messageTemplate || item._id)}
					</a>
				</h3>
				{detail}
			</div>
		);
	}
});