//SEE https://github.com/ongoworks/meteor-security

Security.defineMethod("ifOwnerExists", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    return !(typeof doc.owner && typeof doc.owner == 'string' && 
      Meteor.users.findOne(doc.owner, { fields: { _id: 1 }}));
  }
});

Security.defineMethod("ownerIsLoggedInUser", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    return userId !== doc.owner;
  }
});

Security.defineMethod("idIsLoggedInUser", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    return userId !== doc._id;
  }
});

// Sets the owner property of document, and sets created date.
Security.defineMethod("setOwnerUser", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    doc.owner = userId;
    return false;
  }
});

Security.defineMethod("updateModified", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    if(!doc.created) {
      doc.created = new Date();
    }
    doc.modified = new Date();
    return false;
  }
});

// May be used as simple trigger responder to client-side updates
Security.defineMethod("watchChangesByBasic", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    if(type === 'update') {
      console.log('Had changes by basic user', userId, 'doc', doc._id);
    }
    return false;
  }
});
