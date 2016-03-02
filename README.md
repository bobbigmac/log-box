# Log Box

Realtime listener/display for remote logging events.

## Demo

http://logjar.com

`http://logjar.com/add/?owner=YOUR_API_KEY&level=info&title=My%20awesome%20message%20on%20logbox`

## Usage

* Run `meteor`.
* Visit in a browser, register a user apikey (for the default product).
* POST any set of parameters to `/add/` along with `{ owner: apikey, level: 'info', title: "my awesome event" }`.

Implemented levels are `['debug', 'info', 'success', 'warning', 'error', 'fatal']`

Click an Event heading to inspect the full event data. Click a data-point in a chart to limit the Events list to that hour (Refresh the page to reset to viewing last 50).

## Non-ui features

Some features don't have UI components to set:

```javascript
//Change number of columns the graphs fit (accepting 1-4)
Session.set('masonryCap', 3);
//Rename a product
Products.update(Products.findOne({ name: 'Current Name' })._id, { $set: { name: 'New Name' }});
//Delete a product
Products.remove(Products.findOne({ name: 'Current Name' })._id);
```

## Todo

* Probably wants CORS on the /add/ endpoint.

## Contributing

Fork, feature-branch and PR, comment to explain additions/changes.
