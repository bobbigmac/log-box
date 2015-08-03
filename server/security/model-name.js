
// Example of watching for changes by a client-side user to optional property, then reacting to that change for document enrichment or other action by the server.

// Games.permit('update')
// 	.ifHasRole('basic')
// 	//.onlyProps(['keySets'])
// 	.watchChangesByBasic()
// 	.apply();