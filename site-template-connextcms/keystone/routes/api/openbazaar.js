var keystone = require('keystone');
var request = require('request');
var Promise = require('node-promise'); //Promises to handle asynchonous callbacks.
var rp = require('request-promise');


var DevicePublicModel = keystone.list('DevicePublicModel');
var DevicePrivateModel = keystone.list('DevicePrivateModel');
var obContractModel = keystone.list('obContractModel');


// Creates a listing on OpenBazaar based on an obContractModel.
// An obContractModel GUID is passed in the URI.
exports.createMarketListing = function(req, res) {
  debugger;

  obContractModel.model.findById(req.params.id).exec(function(err, item) {

    if (err) return res.apiError('database error', err);
    if (!item) return res.apiError('not found');

    debugger;

    var listingData = {
     coupons: [],
     refundPolicy: "",
     shippingOptions: [],
     termsAndConditions: "",
     metadata: {
       contractType: "SERVICE",
       expiry: item.get('experation'),
       format: "FIXED_PRICE",
       pricingCurrency: "USD"
     },
     item: {
       categories: [],
       condition: "NEW",
       description: item.get('description'),
       nsfw: false,
       options: [],
       price: item.get('price'),
       tags: [],
       title: item.get('title'),
       images: [{
         filename: "credit-card-with-shield_1614962.jpg",
         large: "zb2rhhtQdSwgE3AM16K7LcsgiHkr4ZXZhS5f45sde54VMggK7",
         medium: "zb2rheZ8fFD5BJ3VxxP8Up6VoiAhVxvUtis1Gz5wEzjoaAUCg",
         original: "zb2rhfb4edYSwx5rkZocYSbfHjgjiQb6U4G438o8GinSHqZWf",
         small: "zb2rhb7KNDTpam86rCUxJijwLTeyzpenePHSetiF33hBp4x68",
         tiny: "zb2rhmDhLrFuPSBosAfqpdaayoD4ttZYvtkDBL6MLP6kiPALU"
       }],
       skus: [{
         quantity: -1
       }]
      }
    };

    var apiCredentials = getAuth();

    var options = {
      method: 'POST',
      uri: 'http://localhost:4002/ob/listing',
      body: listingData,
      json: true, // Automatically stringifies the body to JSON
      headers: {
        'Authorization': apiCredentials
      }
    };

    rp(options)
    .then(function (data) {
      debugger;
    })
    .catch(function (data) {
      debugger;
    });

  });


  debugger;



  res.apiResponse({success: true});
}

// Removes a listing on OpenBazaar based on data in an obContractModel.
// An obContractModel GUID is passed in the URI.
exports.removeMarketListing = function(req, res) {
  res.apiResponse({success: true});
}

// Updates a listing on OpenBazaar based on data in an obContractModel.
// An obContractModel GUID is passed in the URI.
exports.updateListing = function(req, res) {
  res.apiResponse({success: true});
}

/**
 * List Devices
 */
exports.list = function(req, res) {
  DevicePublicModel.model.find(function(err, items) {

    if (err) return res.apiError('database error', err);

    res.apiResponse({
        collection: items
    });

  });
}


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
    //debugger;

    ownerItems = results;

    // Find all entries that have this user associated as the renter.
    var promiseGetRenterModels = getRenterModels(userId);
    promiseGetRenterModels.then( function(results) {
      //debugger;

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

	var item = new DevicePublicModel.model(),
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

	DevicePublicModel.model.findById(req.params.id).exec(function(err, item) {

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

  DevicePublicModel.model.findById(req.params.id).exec(function (err, item) {

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


/**
 * This API is called by the RPi client to register a new device.
 */
exports.register = function(req, res) {

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

	DevicePublicModel.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		var data = (req.method == 'POST') ? req.body : req.query;

    debugger;

    try {

      item.set('memory', data.memory);
      item.set('diskSpace', data.diskSpace);
      item.set('processor', data.processor);
      item.set('internetSpeed', data.internetSpeed);
      item.set('checkinTimeStamp', data.checkinTimeStamp);
      item.save();

      var deviceData;

      // Needs to reference localhost since it's calling itself.
      request('http://localhost:3000/api/portcontrol/create',
      function (error, response, body) {

        //If the request was successfull.
        if (!error && response.statusCode == 200) {
          //debugger;

          //Convert the data from a string into a JSON object.
          var data = JSON.parse(body); //Convert the returned JSON to a JSON string.
          deviceData = data.newDevice;

          // Retrieve the devicePrivateModel associated with this device.
          var privateDeviceId = item.get('privateData');
          DevicePrivateModel.model.findById(privateDeviceId).exec(function(err, privModel) {
            //debugger;

            if (err) return res.apiError('database error', err);
		        if (!privModel) return res.apiError('not found');

            // Save the data to the devicePrivateModel.
            privModel.set('deviceUserName', deviceData.username);
            privModel.set('devicePassword', deviceData.password);
            privModel.set('serverSSHPort', deviceData.port);
            privModel.save();
          });

          res.apiResponse({
            clientData: deviceData
          })

          console.log('API call to portcontrol succeeded!');

        //Server returned an error.
        } else {
          //debugger;

          try {

            var msg = '...Error returned from server when requesting log file status. Server returned: '+error.message;
            console.error(msg);

            res.apiError(msg, error);

          //Catch unexpected errors.
          } catch(err) {
            var msg = 'Error in devicePublicData.js/register() while trying to call /api/portcontrol/create. Error: '+err.message;
            console.error(msg);

            res.apiError(msg, err);
          }
        }
      });

      //Save data to the devicePrivateModel

      //Return the data to the client.
      //var obj = {};
      //obj.username = 'test123';
      //obj.password = 'password123';
      //obj.port = 'port123';
      //obj.username = data.username;
      //obj.password = data.password;
      //obj.port = data.port;



    } catch(err) {
      debugger;

      console.error('Error while trying to process registration data: ', err);
    }

    /*
		item.getUpdateHandler(req).process(data, function(err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				collection: item
			});

		});
    */

	});
}


/**** BEGIN PROMISE AND UTILITY FUNCTIONS ****/

function getAuth() {
  //debugger;

  var clientID = "yourUsername";
  var clientSecret = "yourPassword";

  //Encoding as per Centro API Specification.
  var combinedCredential = clientID+':'+clientSecret;
  var base64Credential = window.btoa(combinedCredential);
  var readyCredential = 'Basic '+base64Credential;


  return readyCredential;

}

/**** END PROMISE AND UTILITY FUNCTIONS ****/
