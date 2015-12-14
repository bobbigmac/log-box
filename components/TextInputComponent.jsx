TextInput = React.createClass({
	statics: {
		remotePriority(remoteVal, dirtyVal, props) {
			return remoteVal;
		},
		dirtyPriority(remoteVal, dirtyVal, props) {
			return dirtyVal;
		},
	},
	getInitialState: function() {
		return {
			value: this.props.defaultValue
		};
	},
	componentWillReceiveProps(nextProps) {
		const cur = this.state && this.state.value;
		let val = nextProps.defaultValue || '';
		let isDirty = (this.state && this.state.isDirty);
		let isEqual = _.isEqual(val, cur);

		// Update the state if it's an external message, and changed
		if((event instanceof MessageEvent || event instanceof PopStateEvent) && !isEqual) {
			if(isDirty && this.props.solveDirty) {
				val = this.props.solveDirty(val, cur, this.props);
				isEqual = _.isEqual(val, cur);
			}
			if(!isEqual) {
				this.setState({ value: val });
			}
		}
	},
	blurred(event) {
		if(this.props.onBlur) {
			this.props.onBlur(this.state, this.props);
		}
	},
	focused(event) {
		if(this.props.onBlur) {
			this.props.onBlur(this.state, this.props);
		}
	},
	changed(event) {
		const val = event.target && event.target.value;
		const cur = this.state && this.state.value;

		if(!_.isEqual(cur, val)) {
			let newState = { value: val, isDirty: true };
			this.setState(newState);
			
			if(this.props.onChange) {
				this.props.onChange(newState, this.props);
			}
		}
	},
	render() {
		if(this.props.multiline) {
			return (
				<div className="form-group">
					<textarea
						className="form-control"
						onChange={this.changed} 
						onFocus={this.focused}
						onBlur={this.blurred}
						placeholder={this.props.placeholder}
						disabled={this.props.disabled}
						value={this.state.value} />
				</div>);
		} else {
			return (
				<div className="form-group">
					<input type="text"
						className="form-control"
						onChange={this.changed} 
						onFocus={this.focused}
						onBlur={this.blurred}
						placeholder={this.props.placeholder}
						disabled={this.props.disabled}
						value={this.state.value} />
				</div>);
		}
	}
});