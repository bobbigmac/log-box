EditInterestComponent = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData() {
		var id = this.props.id;
		var handle = Meteor.subscribe("interest", id);

		return {
			loading: !handle.ready(),
			interest: (id && Interests.findOne(id)) || {},
		};
	},
	fields: {
		url: { display: 'Homepage', required: true, invalidMsg: "Homepage must be url format.", validateAs: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,15})([\/\w \.-]*)*\/?$/ },
		name: { display: 'Name', required: true, requiredMsg: "Name is required." },
		test: { display: 'Test' },
	},
	handleSubmit(error, formData) {
		const interestId = this.props.id;
		const keys = Object.keys(formData);

		let data = {};
		let validCount = 0;
		const validKeys = keys.map(function(key) {
			if(formData && formData[key] && formData[key].valid) {
				data[key] = formData[key].value;
				validCount++;
			}
		});
		const allValid = (keys.length === validCount);

		if(!interestId && allValid) {
			Interests.insert(data, function(error, id) {
				FlowRouter.go('edit-interest', { id: id });
			});
		} else if(validCount) {
			Interests.update(interestId, {
				$set: data
			});
		}
	},
	render() {
		if(Meteor.isServer || this.data.loading) {
			return <div className="loader"></div>;
		}
		
		let interest = ((this.data && this.data.interest) || {});
		let editName = (interest._id ? 'Save' : 'Add');
		let formId = "interestForm";

		return (
			<SmartForm.Form id={formId} role="form" onSubmit={this.handleSubmit}>
				
				{Object.keys(this.fields).map(function(id) {
					return (<EditFieldComponent
						id={id}
						key={id}
						formId={formId} 
						defaultValue={interest[id]}
						{...this.fields[id]} 
					/>)
				}.bind(this))}

				<input className="btn btn-default" type="submit" value={editName} />
			</SmartForm.Form>
		)
	}
});