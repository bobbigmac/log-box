# Log Box

Realtime listener/display for remote logging events.

## Demo

http://logjar.com

`http://logjar.com/add/?owner=YOUR_API_KEY&level=info&message=My%20awesome%20message%20on%20logbox`

## Usage

* Run `meteor`.
* Visit in a browser, register a user apikey (for the default product).
* POST any set of parameters to `/add/` along with `{ owner: apikey, level: 'info', message: "my awesome event" }`.

Default levels are `['debug', 'info', 'success', 'warning', 'error', 'fatal']`

Click an Event heading to inspect the full event data. Click a data-point in a chart to limit the Events list to that product for that hour. Click a legend entry to limit the Events list to events of that level.

Recently addded support for aggregating by fields other than level, though filtering is not yet functional for those fields.

## Non-ui features

Some features don't have UI components to set:

```javascript
//Filter events list (both must be dates)
Session.set('viewedStartDate', new Date(new Date().getTime()-(1000*60*60*1 /*an hour*/)));
Session.set('viewedEndDate', new Date());
```

## Contributing

Fork, feature-branch and PR, comment to explain additions/changes.
