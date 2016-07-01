var pathFor = function( path, params ) {
  var query = params && params.query ? FlowRouter._qs.parse( params.query ) : {};
  return FlowRouter.path( path, params, query );
};

var urlFor = function( path, params ) {
  return Meteor.absoluteUrl( pathFor( path, params ) );
};

var currentRoute = function( route ) {
  FlowRouter.watchPathChange();
  return FlowRouter.current().route.name === route ? 'active' : '';
};

FlowHelpers = {
  pathFor: pathFor,
  urlFor: urlFor,
  currentRoute: currentRoute
};