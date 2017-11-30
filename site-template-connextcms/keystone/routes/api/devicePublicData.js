var keystone = require('keystone')
var request = require('request')
var Promise = require('node-promise') // Promises to handle asynchonous callbacks.

var DevicePublicModel = keystone.list('DevicePublicModel')
var DevicePrivateModel = keystone.list('DevicePrivateModel')

/**
 * List Devices
 */
exports.list = function (req, res) {
  DevicePublicModel.model.find(function (err, items) {
    if (err) return res.apiError('database error', err)

    res.apiResponse({
      collection: items
    })
  })
}

/*
 * List any device models associated with this user, both Owner and Renter.
 */
exports.listById = function (req, res) {
  // Get the users ID
  try {
    var userId = req.user.get('id').toString()
  } catch (err) {
    // Error handling.
    return res.apiError('error', 'Could not retrieve user ID. You must be logged in to use this API.')
  }

  var ownerItems

  // Get any models that match the userId as the Owner
  var promiseGetOwnerModels = getOwnerModels(userId)
  promiseGetOwnerModels.then(function (results) {
    // debugger;

    ownerItems = results

    // Find all entries that have this user associated as the renter.
    var promiseGetRenterModels = getRenterModels(userId)
    promiseGetRenterModels.then(function (results) {
      // debugger;

      // Combine and return matching entries.
      ownerItems = ownerItems.concat(results)

      // Return the collection of matching items
      res.apiResponse({
        collection: ownerItems
      })
    }, function (error) {
      console.error('Error resolving promise for /routes/api/devicePublicData.js/getRenterModels(' + userId + '). Error:', error)
    })
  }, function (error) {
    console.error('Error resolving promise for /routes/api/devicePublicData.js/getOwnerModels(' + userId + '). Error:', error)
  })
}

/**
 * Create DevicePrivateModel
 */
exports.create = function (req, res) {
	// debugger;

  // Ensure the user has a valid CSRF token
	// if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	// }

  var item = new DevicePublicModel.model(),
    data = (req.method == 'POST') ? req.body : req.query

  item.getUpdateHandler(req).process(data, function (err) {
    if (err) return res.apiError('error', err)

    res.apiResponse({
      collection: item
    })
  })
}

/**
 * Update DevicePrivateModel by ID
 */
exports.update = function (req, res) {
  // Ensure the user has a valid CSRF token
	// if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	// }

  // Ensure the user making the request is a Keystone Admin
  // var isAdmin = req.user.get('isAdmin');
  // if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  // }

  // Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  // This is a check to make sure the user is a ConnexstCMS Admin
  // var admins = keystone.get('admins');
  // var userId = req.user.get('id');
  // if(admins.indexOf(userId) == -1) {
  //  return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  // }

  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err)
    if (!item) return res.apiError('not found')

    var data = (req.method == 'POST') ? req.body : req.query

    item.getUpdateHandler(req).process(data, function (err) {
      if (err) return res.apiError('create error', err)

      res.apiResponse({
        collection: item
      })
    })
  })
}

/**
 * Get DevicePublicModel by ID
 */
exports.getId = function (req, res) {
  // Ensure the user has a valid CSRF token
	// if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	// }

  // Ensure the user making the request is a Keystone Admin
  // var isAdmin = req.user.get('isAdmin');
  // if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  // }

  // Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  // This is a check to make sure the user is a ConnexstCMS Admin
  /*
  var admins = keystone.get('admins');
  var userId = req.user.get('id');
  if(admins.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  }
  */

  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err)
    if (!item) return res.apiError('not found')

    return res.apiResponse({
      collection: item
    })
  })
}

/**
 * Delete DevicePrivateModel by ID
 */
exports.remove = function (req, res) {
  // Ensure the user has a valid CSRF token
	// if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	// }

  // Ensure the user making the request is a Keystone Admin
  // var isAdmin = req.user.get('isAdmin');
  // if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  // }

  // Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  // This is a check to make sure the user is a ConnexstCMS Admin
  /*
  var admins = keystone.get('admins');
  var userId = req.user.get('id');
  if(admins.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  }
  */

  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err)
    if (!item) return res.apiError('not found')

    item.remove(function (err) {
      if (err) return res.apiError('database error', err)

      return res.apiResponse({
        success: true
      })
    })
  })
}

/**
 * This API is called by the RPi client to register a new device.
 */
exports.register = function (req, res) {
  // Ensure the user has a valid CSRF token
	// if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	// }

  // Ensure the user making the request is a Keystone Admin
  // var isAdmin = req.user.get('isAdmin');
  // if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  // }

  // Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  // This is a check to make sure the user is a ConnexstCMS Admin
  // var admins = keystone.get('admins');
  // var userId = req.user.get('id');
  // if(admins.indexOf(userId) == -1) {
  //  return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  // }

  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err)
    if (!item) return res.apiError('not found')

    var data = (req.method == 'POST') ? req.body : req.query

    debugger

    try {
      item.set('memory', data.memory)
      item.set('diskSpace', data.diskSpace)
      item.set('processor', data.processor)
      item.set('internetSpeed', data.internetSpeed)
      item.set('checkinTimeStamp', data.checkinTimeStamp)
      item.save()

      var deviceData

      // Needs to reference localhost since it's calling itself.
      request('http://localhost:3000/api/portcontrol/create',
      function (error, response, body) {
        // If the request was successfull.
        if (!error && response.statusCode == 200) {
          // debugger;

          // Convert the data from a string into a JSON object.
          var data = JSON.parse(body) // Convert the returned JSON to a JSON string.
          deviceData = data.newDevice

          // Retrieve the devicePrivateModel associated with this device.
          var privateDeviceId = item.get('privateData')
          DevicePrivateModel.model.findById(privateDeviceId).exec(function (err, privModel) {
            // debugger;

            if (err) return res.apiError('database error', err)
		        if (!privModel) return res.apiError('not found')

            // Save the data to the devicePrivateModel.
            privModel.set('deviceUserName', deviceData.username)
            privModel.set('devicePassword', deviceData.password)
            privModel.set('serverSSHPort', deviceData.port)
            privModel.save()
          })

          res.apiResponse({
            clientData: deviceData
          })

          console.log('API call to portcontrol succeeded!')

        // Server returned an error.
        } else {
          // debugger;

          try {
            var msg = '...Error returned from server when requesting log file status. Server returned: ' + error.message
            console.error(msg)

            res.apiError(msg, error)

          // Catch unexpected errors.
          } catch (err) {
            var msg = 'Error in devicePublicData.js/register() while trying to call /api/portcontrol/create. Error: ' + err.message
            console.error(msg)

            res.apiError(msg, err)
          }
        }
      })

      // Save data to the devicePrivateModel

      // Return the data to the client.
      // var obj = {};
      // obj.username = 'test123';
      // obj.password = 'password123';
      // obj.port = 'port123';
      // obj.username = data.username;
      // obj.password = data.password;
      // obj.port = data.port;
    } catch (err) {
      debugger

      console.error('Error while trying to process registration data: ', err)
    }

    /*
		item.getUpdateHandler(req).process(data, function(err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				collection: item
			});

		});
    */
  })
}

// Simple stand-alone function for users to retrieve their ID when logged in, or notify if they are not logged in.
exports.getUserId = function (req, res) {
  // Get the users ID
  try {
    var userId = req.user.get('id').toString()
    return res.apiResponse({ userId: userId })
  } catch (err) {
    // Error handling.
    return res.apiError('error', 'Could not retrieve user ID. You must be logged in to use this API.')
  }
}

// This function allows Clients to check-in and notify the server they are still actively
// connected to the internet. This should happen every 2 minutes. It updates the checkinTimeStamp
// of the devicePublicModel
exports.checkIn = function (req, res) {
  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err)
    if (!item) return res.apiError('not found')

    var now = new Date()
    var timeStamp = now.toISOString()

    item.set('checkinTimeStamp', timeStamp)
    item.save()

    res.apiResponse({
      success: true
    })
  })
}

// This function allows the p2p-vps-client.js application running on the Client to download the
// expiration for the current Client. When the expiration is hit, it resets the device and wipes
// the old Docker container and persistant storage.
exports.getExpiration = function (req, res) {
  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err)
    if (!item) return res.apiError('not found')

    var now = new Date()
    var timeStamp = now.toISOString()

    item.set('checkinTimeStamp', timeStamp)
    item.save()

    res.apiResponse({
      success: true
    })
  })
}

/** ** BEGIN PROMISE AND UTILITY FUNCTIONS ****/

// Get any devicePublicModels where the userId matches the ownerUser entry.
function getOwnerModels (userId) {
  var promise = new Promise.Promise()

  DevicePublicModel.model.find().where('ownerUser', userId).exec(function (err, items) {
    if (err) promise.reject(err)
    else promise.resolve(items)
  })

  return promise
}

// Get any devicePublicModels where the userId matches the renterUser entry.
function getRenterModels (userId) {
  var promise = new Promise.Promise()

  DevicePublicModel.model.find().where('renterUser', userId).exec(function (err, items) {
    if (err) promise.reject(err)
    else promise.resolve(items)
  })

  return promise
}

/** ** END PROMISE AND UTILITY FUNCTIONS ****/
