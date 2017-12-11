const keystone = require('keystone');
const request = require('request');
// var Promise = require('node-promise') // Promises to handle asynchonous callbacks.
const rp = require('request-promise');

const DevicePublicModel = keystone.list('DevicePublicModel');
const DevicePrivateModel = keystone.list('DevicePrivateModel');

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
    return res.apiError(
      'error',
      'Could not retrieve user ID. You must be logged in to use this API.'
    )
  }

  var ownerItems

  // Get any models that match the userId as the Owner
  var promiseGetOwnerModels = getOwnerModels(userId)
  promiseGetOwnerModels.then(
    function (results) {
      // debugger;

      ownerItems = results

      // Find all entries that have this user associated as the renter.
      var promiseGetRenterModels = getRenterModels(userId)
      promiseGetRenterModels.then(
        function (results) {
          // debugger;

          // Combine and return matching entries.
          ownerItems = ownerItems.concat(results)

          // Return the collection of matching items
          res.apiResponse({
            collection: ownerItems
          })
        },
        function (error) {
          console.error(
            'Error resolving promise for /routes/api/devicePublicData.js/getRenterModels(' +
              userId +
              '). Error:',
            error
          )
        }
      )
    },
    function (error) {
      console.error(
        'Error resolving promise for /routes/api/devicePublicData.js/getOwnerModels(' +
          userId +
          '). Error:',
        error
      )
    }
  )
}

/**
 * Create DevicePrivateModel
 */
exports.create = function (req, res) {
  // debugger;

  // Ensure the user has a valid CSRF token
  // if (!security.csrf.validate(req)) {
  //  return res.apiError(403, 'invalid csrf');
  // }

  let item = new DevicePublicModel.model()
  let data = req.method === 'POST' ? req.body : req.query

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
  //  return res.apiError(403, 'invalid csrf');
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

    var data = req.method === 'POST' ? req.body : req.query

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
  //  return res.apiError(403, 'invalid csrf');
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
  //  return res.apiError(403, 'invalid csrf');
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
  // const DEFAULT_EXPIRATION = 60000 * 60 * 24 * 30; // Thirty Days
  // const DEFAULT_EXPIRATION = 60000 * 60; // One Hour
  const DEFAULT_EXPIRATION = 60000 * 15; // 15 minutes

  // Ensure the user has a valid CSRF token
  // if (!security.csrf.validate(req)) {
  //  return res.apiError(403, 'invalid csrf');
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

  DevicePublicModel.model.findById(req.params.id).exec(function (err, devicePublicModel) {
    if (err) return res.apiError('database error', err)
    if (!devicePublicModel) return res.apiError('not found')

    let data = req.method === 'POST' ? req.body : req.query

    debugger;

    try {
      const now = new Date()
      const expiration = new Date(now.getTime() + DEFAULT_EXPIRATION)

      devicePublicModel.set('memory', data.memory)
      devicePublicModel.set('diskSpace', data.diskSpace)
      devicePublicModel.set('processor', data.processor)
      devicePublicModel.set('internetSpeed', data.internetSpeed)
      devicePublicModel.set('checkinTimeStamp', data.checkinTimeStamp)
      devicePublicModel.set('expiration', expiration)
      devicePublicModel.save()

      var deviceData;

      // Get the private data associated with this public model.
      var privateDeviceId = devicePublicModel.get('privateData')
      DevicePrivateModel.model.findById(privateDeviceId).exec(async function (err, privModel) {
        // debugger;

        // Validation & Error handling.
        if (err) return res.apiError('database error', err)
        if (!privModel) return res.apiError('not found')

        let usedPort = privModel.get('serverSSHPort'); // Get any previously used port assignment.

        // Request new port, login, and password from Port Control.
        // Needs to reference localhost since it's calling itself.
        request('http://localhost:3000/api/portcontrol/create', async function (error, response, body) {
          // If the request was successfull.
          if (!error && response.statusCode === 200) {
            // debugger;

            // Convert the data from a string into a JSON object.
            var data = JSON.parse(body) // Convert the returned JSON to a JSON string.
            deviceData = data.newDevice;

            // Save the data to the devicePrivateModel.
            privModel.set('deviceUserName', deviceData.username);
            privModel.set('devicePassword', deviceData.password);
            privModel.set('serverSSHPort', deviceData.port);
            await privModel.save()

            // If a previous port was being used, release it.
            // Dev Note: Order of operation is important here. I want to release the old port
            // *after* I request a new port. Otherwise I'll run into SSH issues.
            if (usedPort) {
              // debugger;
              // Release the used port.
              await releasePort(usedPort);
            }

            // Create an OB store listing for this device.
            submitToMarket(devicePublicModel)
            .then(obContractId => {
              debugger;
              // Update the devicePublicModel with the newly created obContract model GUID.
              devicePublicModel.set('obContract', obContractId);
              devicePublicModel.save();
            })
            .catch(err => {
              debugger;
              console.error('Error trying to execute submitToMarket:');
              console.error(JSON.stringify(err, null, 2));
            })

            res.apiResponse({
              clientData: deviceData
            });

            console.log('API call to portcontrol succeeded!')

          // Server returned an error.
          } else {
            debugger;

            try {
              var msg =
                'Call to Port Control failed. Server returned: ' +
                error.message
              console.error(msg)

              res.apiError(msg, error)

              // Catch unexpected errors.
            } catch (err) {
              msg =
                'Error in devicePublicData.js/register() while trying to call /api/portcontrol/create. Error: ' +
                err.message
              console.error(msg)

              res.apiError(msg, err)
            }
          }
        })
      });
    } catch (err) {
      debugger;

      console.error('Error while trying to process registration data:');
      console.error(JSON.stringify(err, null, 2));
    }
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
    return res.apiError(
      'error',
      'Could not retrieve user ID. You must be logged in to use this API.'
    )
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

    const now = new Date();

    let expiration = new Date(item.expiration);

    // If the expiration time has passed.
    if (expiration.getTime() < now.getTime()) {
      // Remove the listing from the OB store
      console.log(`Removing listing for ${item._id}`);
      removeOBListing(item)
      .then(() => {
        console.log(`OB Listing for ${item._id} successfully removed.`);
      })
      .catch(err => {
        console.error(`Error trying to remove the OB listing for ${item._id}`);

        if (err.statusCode >= 500) {
          console.error(`There was an issue with finding the listing on the OpenBazaar server. Skipping.`);
        } else {
          console.error(JSON.stringify(err, null, 2));
        }
      });
    }

    res.apiResponse({
      expiration: item.expiration
    })
  })
}

/** ** BEGIN PROMISE AND UTILITY FUNCTIONS ****/

// Get any devicePublicModels where the userId matches the ownerUser entry.
function getOwnerModels (userId) {
  // var promise = new Promise.Promise()
  return new Promise(function (resolve, reject) {
    DevicePublicModel.model
    .find()
    .where('ownerUser', userId)
    .exec(function (err, items) {
      if (err) reject(err)
      else resolve(items)
    })
  });
}

// Get any devicePublicModels where the userId matches the renterUser entry.
function getRenterModels (userId) {
  return new Promise(function (resolve, reject) {
  // var promise = new Promise.Promise()

    DevicePublicModel.model
    .find()
    .where('renterUser', userId)
    .exec(function (err, items) {
      if (err) reject(err)
      else resolve(items)
    })
  });
  // return promise
}

// This function communicates with Port Control to release the port.
function releasePort (port) {
  return new Promise(function (resolve, reject) {
    if ((port === undefined) || (port === '')) return reject('Invalid port');

    request(`http://localhost:3000/api/portcontrol/${port}/remove`, function (error, response, body) {
      // If the request was successfull.
      if (!error && response.statusCode === 200) {
        // debugger;
        console.log(`Port ${port} successfully released from Port Control`);
        resolve(true);

      // Server returned an error.
      } else {
        debugger;

        var msg =
          'Call to Port Control failed. Server returned: ' +
          error.message
        console.error(msg)

        return reject(msg);
      }
    })
  });
}

function submitToMarket (device) {
  return new Promise(async function (resolve, reject) {
    debugger

    // Check if device already has an obContract GUID associated with it.
    const obContractId = device.get('obContract');
    if (obContractId !== '' && obContractId !== null) {
      debugger;
      await removeOBListing(device);
    }

    var now = new Date()
    var oneMonth = 1000 * 60 * 60 * 24 * 30
    var oneMonthFromNow = new Date(now.getTime() + oneMonth)

    // Create new obContract model
    var obj = {
      clientDevice: device._id,
      ownerUser: device.ownerUser,
      renterUser: '',
      price: 30,
      experation: oneMonthFromNow.toISOString(),
      title: device.deviceName,
      description: device.deviceDesc,
      listingUri: '',
      imageHash: '',
      listingState: 'Listed',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }

    let options = {
      method: 'POST',
      uri: 'http://localhost:3000/api/obContract/create',
      body: obj,
      json: true // Automatically stringifies the body to JSON
      // resolveWithFullResponse: true
    }

    // Create the obContract model.
    return rp(options)

    // Use the new obContract model to create a listing on OpenBazaar.
    .then(obContractModel => {
      // debugger

      options = {
        method: 'GET',
        uri: `http://localhost:3000/api/ob/createMarketListing/${obContractModel.collection._id}`,
        // body: listingData,
        json: true // Automatically stringifies the body to JSON
        // resolveWithFullResponse: true
      }

      return rp(options)
      .then(data => {
        debugger;
        if (data.success) console.log('Successfully created OB listing.');
        else console.log('OB listing creation failed.');

        return resolve(obContractModel.collection._id);
      });
    })

    // Catch any errors.
    .catch(function (err) {
      debugger
      console.error('Error trying to create OB listing in submitToMarket():');
      console.error(JSON.stringify(err, null, 2));
      return reject(err);
    })
  });
}

// This function remove the associated listing from the OB store.
function removeOBListing (deviceData) {
  debugger;

  const obContractId = deviceData.obContract;

  // Validation/Error Handling
  if (obContractId === undefined || obContractId === null) {
    throw `no obContract model associated with device ${deviceData._id}`;
  }

  const options = {
    method: 'GET',
    uri: `http://p2pvps.net/api/ob/removeMarketListing/${obContractId}`,
    json: true // Automatically stringifies the body to JSON
  };

  return rp(options)
    .then(function (data) {
      debugger;

      if (!data.success) {
        throw `Could not remove device ${obContractId} from rentedDevices list model.`;
      }

      console.log(
        `Successfully removed listing on OB store with obContract model ID ${obContractId}`
      );
      return true;
    })
    .catch(err => {
      debugger;
      console.error(`Could not remove device ${obContractId} from rentedDevices list model.`);
      throw err;
    });
}

/** ** END PROMISE AND UTILITY FUNCTIONS ****/
