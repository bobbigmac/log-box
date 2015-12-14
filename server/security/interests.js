
Interests.permit('insert')
	.ifHasRole('basic')
	.setOwnerUser()
	.apply();

Interests.permit('update')
	.ifHasRole('basic')
	.ownerIsLoggedInUser()
	.apply();

Interests.permit('update')
	.ifHasRole('basic')
	.onlyProps(['flags'])
	// .onlyActions(['push'])
	.apply();

Interests.permit('update')
	.ifHasRole('admin')
	.apply();

Interests.permit('remove')
	.ownerIsLoggedInUser()
	.apply();
	
Interests.permit('remove')
	.ifHasRole('admin')
	.apply();