EditInterestComponent = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData() {
		var id = this.props.id;
		var handle = Meteor.subscribe("interest", id);
		
		//console.log('refreshing data', id);
		return {
			//Render immediately (kinda works offline)
			loading: (id ? !Interests.find(id).count() : !handle.ready()),
			//Render properly (only works online)
			// loading: !handle.ready(),
			interest: (id && Interests.findOne(id)) || {},
		};
	},
	fields: {
		url: { display: 'Homepage', col: 'col-sm-6 col-xs-12', required: true, invalidMsg: "Homepage must be url format.", validateAs: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,15})([\/\w \.-]*)*\/?[^\s]*$/ },
		title: { display: 'Title', col: 'col-sm-6 col-xs-12' }, //required: true, requiredMsg: "Title is required." },
		text: { display: 'Description', type: "textarea", col: 'col-sm-12 col-xs-12', multiline: 3 }, //TODO: Need to implement multiline on the component
		tags: { display: 'Tags', type: "tags", col: 'col-sm-12 col-xs-12' }, //, 'data-role': 'tagsinput' },
	},
	componentWillReceiveProps() {
		this.replaceState({});
	},
	handleSubmit(event) {
    event.preventDefault();
    document.activeElement.blur();

    this.setState({ submitting: true });

		const original = (this.data && this.data.interest);
		const interest = ((this.state && this.state.interest) || original || {});
		interestId = interest._id;

		//TODO: Implement validateForm()
		let allValid = !!interest.url;

		let update = Object.keys(interest).reduce(function(update, key, pos) {
			if(!_.isEqual(interest[key], this.data.interest[key])) {
				update[key] = interest[key];
			}
			return update;
		}.bind(this), {});

		var updates = Object.keys(update).length;
		if(!interestId && allValid) {
			Interests.insert(interest, function(error, id) {
				this.setState({ submitting: false });
				FlowRouter.go('edit-interest', { id: id });
			}.bind(this));
		} else if(updates) {
			Interests.update(interestId, {
				$set: update
			}, function(error, affected) {
				this.setState({ submitting: false });
			}.bind(this));
		} else {
			this.setState({ submitting: false });
		}
	},
	handleChange(fieldState, fieldProps) {
		const interest = ((this.state && this.state.interest) || (this.data && this.data.interest) || {});
		const value = fieldState.value;

		interest[fieldProps.id] = value;
		this.setState({ 'interest': interest, 'isDirty': true });
	},
	handleBlur(fieldState, fieldProps) {
		if(this.state && this.state.isDirty) {
			const value = fieldState.value;
			if(fieldProps && fieldProps.id === 'url' && value) {
				let interest = (this.state.interest || this.data.interest || {});
				
				//TODO: Add bobbigmac:scrape-parser if you want this to work
				Meteor.call('scrape-url-interest', value, interest, function(error, interestId) {
					if(interestId && interestId !== interest._id) {
						FlowRouter.go('edit-interest', { id: interestId });
					}
				});
			}
			this.setState({ isDirty: false });
		}
	},
	handleDelete() {
		if(this.props && this.props.id && confirm('Are you sure?')) {
			Interests.remove(this.props.id, function(error, deleted) {
				if(!error) {
					FlowRouter.go('home');
				}
			});
		}
	},
	stringify(val) {
		return ((val || val === 0) && ''+val) || '';
	},
	render() {
		if(Meteor.isServer || this.data.loading) {
			return <div className="loader"></div>;
		}
		
		const userId = Meteor.userId();

		let interest = ((this.data && this.data.interest) || {});
		let editName = (interest._id ? 'Save' : 'Add');
		let formId = "interestForm";

		const mayDelete = (interest.owner === userId || Roles.userIsInRole(userId, ['admin']));
		let deleteButton = (interest._id && mayDelete ? <input className="btn btn-danger" onClick={this.handleDelete} type="button" value="Delete" /> : '');

		return (
			<form id={formId} role="form" onSubmit={this.handleSubmit}>
				
				{Object.keys(this.fields).map(function(key) {
					return (<EditFieldComponent
						id={key}
						key={key}
						formId={formId}
						defaultValue={!this.data.loading && this.stringify(interest[key])}
						onBlur={this.handleBlur}
						onChange={this.handleChange}
						disabled={this.state && this.state.submitting}
						{...this.fields[key]}
					/>);
				}.bind(this))}

				<div className="form-group col-sm-12 col-xs-12">
					<input className="btn btn-default pull-right" type="submit" value={editName+' Listing'} />
					{deleteButton}
				</div>
			</form>
		)
	}
});