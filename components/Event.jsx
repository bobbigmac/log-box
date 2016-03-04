Event = React.createClass({
  mixins: [TimerMixin],
	getInitialState() {
		var event = this.props.event;
		var now = new Date();
		var date = new Date(event && event.created);
		var seconds = Math.abs((now.getTime() - date.getTime()) / 1000);

		var mom = new moment(date);
		var waitSeconds = (seconds > 60*60 ? 60 : 10);

    return {
      detail: false,
      moment: mom,
      waitMs: waitSeconds * 1000,
      fromNow: mom && mom.fromNow()
    };
	},
  componentDidMount() {
  	//Could use setTimeout and update the wait more specifically
    this.setInterval(this.updateFromNow, this.state.waitSeconds);
  },
  updateFromNow() {
  	const newNow = this.state.moment.fromNow();
  	this.setState({ fromNow: newNow });
  	//console.log('updated', newNow);
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
					{(item.created && <span className="pull-right">{this.state.fromNow}</span>)}
					<a className="event-title" onClick={this.toggleDetail}>
						{(item.title || item.message || item.messageTemplate || item._id)}
					</a>
				</h3>
				{detail}
			</div>
		);
	}
});