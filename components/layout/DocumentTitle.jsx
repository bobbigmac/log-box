function setDocumentTitle(title) {
  if(typeof document !== 'undefined') {
    document.title = title;
  }
};

DocumentTitle = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired
  },
  componentWillMount() {
    setDocumentTitle(this.props.title);
  },
  componentWillReceiveProps(newProps) {
    setDocumentTitle(newProps.title);
  },
  render() {
    if (this.props.children) {
      return React.Children.only(this.props.children);
    } else {
      return null;
    }
  }
});