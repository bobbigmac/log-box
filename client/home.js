
/**
 * Runs on render of home route, sets page title
 */
Template.home.rendered = function() {
  $('head title').text(Session.get('brand-name'));
};



/**
 * TODO: Remove this stuff
 */

Session.setDefault('counter', 0);

Template.home.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.home.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});