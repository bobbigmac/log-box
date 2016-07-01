var React = require('react');

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
      timeLimitDays: (Session.get('timeLimitDays') || 2),
      startDate: StartDate,
      endDate: EndDate,
      viewedProduct: Session.get('viewedProduct'),
      viewedValues: Session.get('viewedValues'),
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
	setTimeLimitDays(val) {
		if(typeof val == 'number' && val > 0 && val <= 4) {
			Session.set('timeLimitDays', val);
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
		Session.set('viewedProduct', false);
		Session.set('viewedValues', []);
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

						<div className="btn-group" role="group">
							<a className="btn btn-default" disabled={this.data.timeLimitDays <= 1} onClick={this.setTimeLimitDays.bind(this, this.data.timeLimitDays - 1)}>
								<i className="glyphicon glyphicon-chevron-left"></i>
							</a>
							<label className="btn btn-default" disabled>{(this.data.timeLimitDays || '') + " " + pluraliseString('Day', this.data.timeLimitDays)}</label>
							<a className="btn btn-default" disabled={this.data.timeLimitDays >= 4} onClick={this.setTimeLimitDays.bind(this, this.data.timeLimitDays + 1)}>
								<i className="glyphicon glyphicon-chevron-right"></i>
							</a>
						</div>

						{(this.data.startDate || this.data.viewedProduct) && <div className="btn-group" role="group">
							<button className="btn btn-warning" onClick={this.clearDateFilter}>Clear Event Filter</button>
						</div>}

					</div>
				</div>
			</section>
		);
	}
});