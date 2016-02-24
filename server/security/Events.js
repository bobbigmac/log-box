
Events.permit('insert')
	.ifHasRole('basic')
	.setOwnerUser()
	.updateModified()
	.apply();

Events.permit('insert')
	.ifOwnerExists()
	.updateModified()
	.apply();

Events.permit('update')
	.ifHasRole('basic')
	.ownerIsLoggedInUser()
	.updateModified()
	.apply();

Events.permit('update')
	.ifHasRole('basic')
	.onlyProps(['flags'])
	// .onlyActions(['push'])
	.updateModified()
	.apply();

Events.permit('update')
	.ifHasRole('admin')
	.updateModified()
	.apply();

Events.permit('remove')
	.ownerIsLoggedInUser()
	.apply();
	
Events.permit('remove')
	.ifHasRole('admin')
	.apply();