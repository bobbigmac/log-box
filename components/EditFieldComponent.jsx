EditFieldComponent = React.createClass({
	onValidate(error) {
		//console.log(this.props.id, 'validating', error)
		const isSet = (this.state && this.state.error);
		if(!isSet && error) {
			this.setState({ error: true });
		} else if(isSet && !error) {
			this.setState({ error: false });
		}

		if(this.props.onValidate && typeof this.props.onValidate === 'function') {
			this.props.onValidate.apply(this, arguments);
		}
	},
	formGroupClass() {
		return 'form-group' + (this.state && this.state.error ? ' has-error' : '');
	},
	render() {
		return (
			<div className={this.formGroupClass(this.props.name||this.props.id)}>
				<label htmlFor={this.props.id}>{this.props.display}</label>
				<SmartForm.Input
					ref="control"
					className="form-control"
					placeholder={this.props.display}
					{...this.props}
				/>
				<SmartForm.Error
					linkedTo={this.props.formId+'.'+this.props.id}
					requiredMsg={this.props.display+' is required.'}
					invalidMsg={this.props.invalidMsg}
					onValidate={this.onValidate}
					className="help-block"
				/>
			</div>
		);
	}
});