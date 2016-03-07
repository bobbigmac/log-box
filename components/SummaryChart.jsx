let rerenderTimeout = false

const makeDate = function(date) {
	return ((date && new Date(date.year || 2015, date.month - 1 || 1, date.day || 1, date.hour || 0, date.minute || 0, date.second || 0)) || new Date());
}
const addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
const addHours = function(date, hours) {
    var result = new Date(date);
    result.setTime(result.getTime() + (hours*36e5));//60*60*1000
    return result;
}

SummaryChart = React.createClass({
	mixins: [ReactMeteorData,TimerMixin],
	getMeteorData() {
		if(Meteor.isClient) {
			var timeLimitDays = Session.get('timeLimitDays') || 2;

			var product = Products.findOne(this.props.product);
			var model = product && product.settings && product.settings.model;
			//console.log('subbing with model', model);

			var handle = Meteor.subscribe("eventsGroups", product._id, timeLimitDays, model);
			var batches = EventsGroups.find({ 'product': this.props.product });
			//console.log(batches.count());
			return {
				loading: !handle.ready(),
				user: Meteor.user(),
				periods: batches.fetch(),
				currentTime: Session.get('current-time'),
				timeLimitDays: Session.get('timeLimitDays') || 2,
				model: model
			};
		} else {
			return {};
		}
	},
	getInitialState() {
		var now = new Date();
    return {
    	currentDate: now
    };
	},
	getBaseColumns() {
		// Load columns from Product settings
		var defaultColumns = [['error'], ['warning'], ['info'], ['success'], ['fatal'], ['debug']];
		if(this.data.model) {
			const model = this.data.model;

			defaultColumns = Object.keys(model).reduce(function(cols, field) {
				model[field].forEach(pair => cols.push([pair[0]]));
				return cols;
			}, []);
		}
		return [['x'], ['count']].concat(defaultColumns);
	},
	componentWillReceiveProps(nextProps) {
  	//console.log('will get new props', nextProps, this.data);
  	if(this.data.model && !_.isEqual(this.data.model, this.lastModel)) {
  		console.log('model changed');
  		this.setupChart();
  	}
	},
	componentWillUpdate(nextProps) {
		//console.log('will update', nextProps);
		let columns = this.getBaseColumns();
		//console.log(columns);

		if(this.data && this.data.periods && this.data.periods.length) {
			let handledLast = false
			const periods = this.data.periods.sort((a, b) => a.first > b.first ? 1 : -1);

			columns = periods.reduce(function(cols, p, pos) {
				const date = p.date && makeDate(p.date);

				columns.forEach(function(keyArray, fPos) {
					cols[fPos].push(fPos ? (p[keyArray[0]] || 0) : date);
				});

				if((periods[pos+1] && periods[pos+1].date) || !handledLast) {
					let nextDate = false;
					if(periods[pos+1]) {
						nextDate = makeDate(periods[pos+1].date);
					} else {
						handledLast = nextDate = new Date();

						nextDate.setMinutes(0);
						nextDate.setSeconds(0);
						nextDate = addHours(nextDate, 1);
					}

					const hoursDiff = ((nextDate - date) / 36e5) - 1;//(60*60*1000);
					
					for(var i = 0; i < hoursDiff; i++) {
						let newDate = addHours(date, i+1);

						if(!(newDate.getTime() > (new Date().getTime() - 36e5))) {
							columns.forEach(function(keyArray, fPos) {
								cols[fPos].push(fPos ? 0 : newDate);
							});
						} else {
							cols[0].push(newDate);
						}
					}
				}
				return cols;
			}, columns);
		} else {
			columns = columns.map((x, p) => x.push(p ? 0 : new Date()) && x);
		}

		this.chart.load({
			columns: columns
		});

		//Re-render each minute (no data to show, but will ensure chart always shows to current hour)
		const rerenderMs = 1000 * 60;
		if(rerenderTimeout) {
			Meteor.clearTimeout(rerenderTimeout);
		}
		rerenderTimeout = Meteor.setTimeout(function() { Session.set('current-time', new Date()); }.bind(this), rerenderMs);
	},
	dataPointClicked(d, el) {
		//console.log(d);
		if(d && d.x) {
			Session.set('viewedStartDate', d.x);
			Session.set('viewedEndDate', addHours(d.x, 1));
			Session.set('viewedProduct', this.props.product);
		}
	},
	legendClicked(d, el) {
		if(d != 'count') {
			let viewedValues = Session.get('viewedValues') || [];
			let viewedProduct = Session.get('viewedProduct');
			if(viewedProduct != this.props.product) {
				Session.set('viewedProduct', this.props.product);
				viewedValues = [];
			}

			if(viewedValues && viewedValues instanceof Array) {
				const index = viewedValues.indexOf(d);
				if(index > -1) {
					viewedValues.splice(index, 1);
				} else {
					viewedValues.push(d);
				}

				Session.set('viewedProduct', this.props.product);	
				Session.set('viewedValues', viewedValues);
				//console.log('viewedValues', viewedValues);
			}
		}
	},
	setupChart() {
		if(this.chart) {
			this.chart.destroy();
		}
		this.lastModel = this.data.model;

		// See http://c3js.org/reference.html
		this.chart = c3.generate({
			bindto: this.refs['chart-container'],
			data: {
				x: 'x',
				//xFormat: '%Y-%m-%d %H:%M:%S',
				onclick: this.dataPointClicked,
				columns: this.getBaseColumns(),
        //type: 'area-spline',
        //type: 'spline',
        type: 'line',
			  /*colors: {
			    count: '#999999',
			    error: '#d9534f',
			    warning: '#f0ad4e',
			    info: '#5bc0de',
			    success: '#5cb85c',
			    fatal: '#ff0000',
			    debug: '#cccccc',
			  },*/
			},
			axis: {
				x: {
					type: 'timeseries',
					tick: {
						format: '%d/%Hh',
      			fit: true,
						rotate: 40,
					}
				},
				y: {
					tick: {
						min: 0
					},
					padding: {
						bottom: 0
					}
				},
			},
			legend: {
				item: {
					onclick: this.legendClicked
				}
			}
		});
	},
	componentDidMount() {
		if(!this.chart) {
			this.setupChart();
		}

    this.setInterval(function() {
			var now = new Date();
    	this.setState({ currentDate: now });
    }.bind(this), 60*1000);
	},
	render() {
		return (
			<section>
				<div ref="chart-container">
				</div>
			</section>
		);
	}
});