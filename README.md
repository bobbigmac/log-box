# Log Box

Realtime listener/display for remote logging events.

## Usage

* Run `meteor`.
* Visit in a browser and register a user to get an apikey.
* POST (or GET/PUT) any set of parameters to /add/ along with `{ owner: apikey, title: "my awesome event" }`.

## Todo

* Pretty much everything, this is just a stub that accepts incoming calls from anyone with a valid api key.

* Only outputting example Event atm, will output any/all fields, be formatted and filterable.

* Charts and pretty stuff

* Probably wants CORS on the endpoint.