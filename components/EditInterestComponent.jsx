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
	handleClick(interestId) {
		if(this.refs.name && this.refs.name.value) {
			var data = {
				name: this.refs.name.value,
				url: this.refs.url.value
			};

			if(!interestId) {
				Interests.insert(data, function(error, id) {
					FlowRouter.go('edit-interest', { id: id });
				});
			} else {
				Interests.update(interestId, {
					$set: data
				});
			}
		}
	},
  render() {
  	if(this.data.loading) {
      return <div className="loader">Loading...</div>;
    }
    
    let interest = ((this.data && this.data.interest) || {});
    
		return (
			<div className="form">
				<div className="form-group">
    			<label htmlFor="article-name">Name</label>
				  <input type="text" className="form-control" placeholder="Name" ref="name" defaultValue={interest.name} />
				</div>
				<div className="form-group">
    			<label htmlFor="article-url">Homepage</label>
				  <input type="text" className="form-control" placeholder="Homepage" ref="url" defaultValue={interest.url} />
				</div>
				<button type="submit" onClick={this.handleClick.bind(this, interest._id)} className="btn btn-default">{interest._id ? 'Save' : 'Add'}</button>
			</div>
		)
  }
});