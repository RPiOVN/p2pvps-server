var keystone = require('keystone');
// var request = require('request');
// var Promise = require('node-promise'); // Promises to handle asynchonous callbacks.

// var DevicePublicModel = keystone.list('DevicePublicModel');
// var DevicePrivateModel = keystone.list('DevicePrivateModel');
var obContractModel = keystone.list('obContractModel');

/**
 * List obContractModel
 */
exports.list = function (req, res) {
  obContractModel.model.find(function (err, items) {
    if (err) return res.apiError('database error', err);

    res.apiResponse({
      collection: items
    });
  });
}

/**
 * Create obContractModel
 */
exports.create = function (req, res) {
  // debugger;

  // Ensure the user has a valid CSRF token
  // if (!security.csrf.validate(req)) {
  //  return res.apiError(403, 'invalid csrf');
  // }

  var item = new obContractModel.model();
  var data = (req.method === 'POST') ? req.body : req.query;

  item.getUpdateHandler(req).process(data, function (err) {
    if (err) return res.apiError('error', err);

    res.apiResponse({
      collection: item
    });
  });
}

exports.get = function (req, res) {
  obContractModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err);
    if (!item) return res.apiError('not found');

    res.apiResponse({
      collection: item
    });
  });
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

  obContractModel.model.findById(req.params.id).exec(function (err, item) {
    if (err) return res.apiError('database error', err);
    if (!item) return res.apiError('not found');

    var data = (req.method === 'POST') ? req.body : req.query;

    item.getUpdateHandler(req).process(data, function (err) {
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

  obContractModel.model.findById(req.params.id).exec(function (err, item) {
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
