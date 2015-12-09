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
			return <div className="loader">Loading...</div>;
		}
		
		let interest = ((this.data && this.data.interest) || {});
		let editName = (interest._id ? 'Save' : 'Add');
		let formId = "interestForm";

		return (
			<SmartForm.Form id={formId} onSubmit={this.handleSubmit}>
				
				<EditFieldComponent
					id="name" 
					display="Name" 
					formId={formId} 
					required 
					defaultValue={interest.name} 
				/>
				
				<EditFieldComponent
					id="url" 
					display="Homepage" 
					formId={formId} 
					required 
					validateAs={/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,15})([\/\w \.-]*)*\/?$/}
					invalidMsg="Homepage must be url format."
					defaultValue={interest.url} 
				/>

				<input className="btn btn-default" type="submit" value={editName} />
			</SmartForm.Form>
		)
	}
});