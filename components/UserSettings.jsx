UserSettings = React.createClass({
  mixins: [ReactMeteorData],
	getMeteorData() {
		const user = Meteor.user();
    const profile = (user && user.profile) || {};

    const StartDate = Session.get('viewedStartDate');
    const EndDate = Session.get('viewedEndDate');

    return {
    	user: user,
      profile: profile,
      masonryCap: profile.masonryCap || Session.get('masonryCap'),
      startDate: StartDate,
      endDate: EndDate
    };
	},
	setUserProfile(key, val) {
		const userId =  Meteor.userId();
		if(key && val && userId) {
			Meteor.users.update(userId, {
				$set: {
					'profile.masonryCap': val
				}
			});
		}
	},
	setMasonryCap(val) {
		if(typeof val == 'number' && val > 0 && val <= 4) {
			Session.set('masonryCap', val);
			this.setUserProfile('masonryCap', val);
		}
	},
	clearDateFilter() {
		Session.set('viewedStartDate', false);
		Session.set('viewedEndDate', false);
	},
	render() {
		if(!this.data.user) {
			return <div className="alert alert-warning">You must be registered and logged in to set account settings</div>
		};

		return (
			<section className="container user-settings-container">
				<div className="row">
					<div className="col-xs-12">
						<div className="btn-group" role="group">
							<a className="btn btn-default" disabled={this.data.masonryCap <= 1} onClick={this.setMasonryCap.bind(this, this.data.masonryCap - 1)}>
								<i className="glyphicon glyphicon-chevron-left"></i>
							</a>
							<label className="btn btn-default" disabled>{(this.data.masonryCap || '') + " " + pluraliseString('Chart Column', this.data.masonryCap)}</label>
							<a className="btn btn-default" disabled={this.data.masonryCap >= 4} onClick={this.setMasonryCap.bind(this, this.data.masonryCap + 1)}>
								<i className="glyphicon glyphicon-chevron-right"></i>
							</a>
						</div>
						&nbsp;
						{this.data.startDate && <div className="btn-group" role="group">
							<button className="btn btn-warning" onClick={this.clearDateFilter}>Clear Date Filter</button>
						</div>}

					</div>
				</div>
			</section>
		);
	}
});