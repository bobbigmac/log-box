# Meteor Project Boilerplate

Simple meteor boilerplate for starting any new Meteor web project. Has a simple folder structure for server, client, react components, prep functions and user/model/router config.

## Contains packages:

* react
* kadira:flow-router-ssr
* kadira:react-layout
* less
* accounts-password
* ian:accounts-ui-bootstrap-3
* momentjs:moment
* alanning:roles
* ongoworks:security
* twbs:bootstrap

Have configured basic bootstrap nav, and security permissions on Meteor.users to allow registration via password, editing of the user's own profile fields and removal of their account.

All new signups are assigned role of 'basic'. May also be assigned 'admin' user. Insecure and autopublish are removed. The meteor standard counter++ application is included.

Search codebase for TODO to see any notes to proceed with building a project from this boilerplate.

## Changes

Now using react components instead of blaze templates (though templates can still be added and rendered through react, see `AccountsUIWrapper.jsx`), and now server-side renders, with deferred script loading so some page content is displayed to the user as soon as possible.

Now using flow-router instead of iron-router.

## Notes

Project is intended to be as simple as practically possible, just clone and go, a good starting point for any new project. Clone the project, then remove the origin...

```bash
git clone https://github.com/bobbigmac/simple-meteor-boilerplate.git your-project-name
cd your-project-name
git remote remove origin
git remote add origin https://gith...
```

Aim is to have simply documents, users, roles, permissions, routes and bootstrap UI.

There are [more complex boilerplate projects](https://github.com/matteodem/meteor-boilerplate#other-awesome-boilerplates) around. I'm not interested in typing lots of cli commands just to get started on a boilerplate.

## Suggestions

PRs welcome. Should include example usage of package or suggested new functionality.