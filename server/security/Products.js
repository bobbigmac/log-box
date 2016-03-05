
Products.permit('insert')
	.ifHasRole('basic')
	.setOwnerUser()
	.updateModified()
	.apply();

Products.permit('update')
	.ifHasRole('basic')
	.onlyProps(['name', 'settings'])
	.updateModified()
	.apply();

Products.permit('update')
	.ifHasRole('admin')
	.updateModified()
	.apply();

Products.permit('remove')
	.ownerIsLoggedInUser()
	.apply();
	
Products.permit('remove')
	.ifHasRole('admin')
	.apply();