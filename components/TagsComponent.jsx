TagsInput = React.createClass({
  getInitialState: function() {
		const str = ''+((this.props && (this.props.defaultValue || this.props.value)) || '');
  	return {
  		tags: str.split(/\s*,\s*/)
  	};
  },
	tagClicked(tag) {
		var index = -1;
		if(this.state && 
				this.state.tags && 
				this.state.tags.indexOf && 
				(index = this.state.tags.indexOf(tag)) > -1) {

			this.state.tags.splice(index, 1);
			this.setState({ tags: this.state.tags });
		}
	},
	render() {
		return (
			<div className="tags" {...this.props}>
				{
					this.state.tags.map(function(tag, pos) {
						return (
							<input type="button"
								className="btn btn-link tag" 
								onClick={this.tagClicked.bind(this, tag)} 
								key={tag+'_'+pos} 
								tabIndex="-1" 
								value={tag} />);
					}.bind(this))
				}
			</div>);
	}
});