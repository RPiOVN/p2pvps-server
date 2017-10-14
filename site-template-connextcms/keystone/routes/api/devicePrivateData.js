var keystone = require('keystone');
var Promise = require('node-promise'); //Promises to handle asynchonous callbacks.


var DevicePrivateModel = keystone.list('DevicePrivateModel');



/*
 * List any device models associated with this user, both Owner and Renter.
 */
exports.listById = function(req, res) {
  
  //Get the users ID
  try {
    var userId = req.user.get('id').toString();
  } catch(err) {
    //Error handling.
    return res.apiError('error', 'Could not retrieve user ID. You must be logged in to use this API.');
  }
  
  var ownerItems;
  
  // Get any models that match the userId as the Owner
  var promiseGetOwnerModels = getOwnerModels(userId);      
  promiseGetOwnerModels.then( function(results) {
    debugger;

    ownerItems = results;
    
    // Find all entries that have this user associated as the renter.
    var promiseGetRenterModels = getRenterModels(userId);
    promiseGetRenterModels.then( function(results) {
      debugger;
      
      // Combine and return matching entries.
      ownerItems = ownerItems.concat(results);
      
      // Return the collection of matching items
      res.apiResponse({
        collection: ownerItems
      });
      
    }, function(error) {

      console.error('Error resolving promise for /routes/api/devicePublicData.js/getRenterModels('+userId+'). Error:', error);

    });

  }, function(error) {

    console.error('Error resolving promise for /routes/api/devicePublicData.js/getOwnerModels('+userId+'). Error:', error);

  });
  
}


/**
 * Create DevicePrivateModel
 */
exports.create = function(req, res) {
	//debugger;
  
  //Ensure the user has a valid CSRF token
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
	var item = new DevicePrivateModel.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			collection: item
		});
		
	});
  
}

/**
 * Update DevicePrivateModel by ID
 */
exports.update = function(req, res) {
  
  //Ensure the user has a valid CSRF token
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Ensure the user making the request is a Keystone Admin
  //var isAdmin = req.user.get('isAdmin');
  //if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  //}
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  //var admins = keystone.get('admins');
  //var userId = req.user.get('id');
  //if(admins.indexOf(userId) == -1) {
  //  return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  //}
  
	DevicePrivateModel.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				collection: item
			});
			
		});
		
	});
}

/**
 * Delete DevicePrivateModel by ID
 */
exports.remove = function(req, res) {
	
  //Ensure the user has a valid CSRF token
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Ensure the user making the request is a Keystone Admin
  //var isAdmin = req.user.get('isAdmin');
  //if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  //}
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  /*
  var admins = keystone.get('admins');
  var userId = req.user.get('id');
  if(admins.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  }
  */
  
  DevicePrivateModel.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			
			return res.apiResponse({
				success: true
			});
		});
		
	});
}


/**** BEGIN PROMISE AND UTILITY FUNCTIONS ****/

//Get any devicePublicModels where the userId matches the ownerUser entry.
function getOwnerModels(userId) {
  var promise = new Promise.Promise();
  
  DevicePrivateModel.model.find().where('ownerUser', userId).exec(function(err, items) {
    if (err) promise.reject(err);
    else promise.resolve(items);
  });
  
  return promise;
}


//Get any devicePublicModels where the userId matches the renterUser entry.
function getRenterModels(userId) {
  var promise = new Promise.Promise();
  
  DevicePrivateModel.model.find().where('renterUser', userId).exec(function(err, items) {
    if (err) promise.reject(err);
    else promise.resolve(items);
  });
  
  return promise;
}


/**** END PROMISE AND UTILITY FUNCTIONS ****/
