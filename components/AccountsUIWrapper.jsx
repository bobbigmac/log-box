AccountsUIWrapper = React.createClass({
  componentDidMount() {
    this.view = Blaze.render(Template._loginButtons,
      ReactDOM.findDOMNode(this.refs.container));
  },
  componentWillUnmount() {
    Blaze.remove(this.view);
  },
  render() {
    return (<ul ref="container" className={this.props.className}></ul>)
  }
});