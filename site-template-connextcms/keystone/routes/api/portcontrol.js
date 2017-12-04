// var async = require('async')
const keystone = require('keystone')
// var sudo = require('sudo'); //Used to execut sudo level commands with spawn

const PortsUsedModel = keystone.list('PortsUsedModel')

/**
 * Generate a random username, password, and get a port assignement.
 */
exports.create = function (req, res) {
  // debugger;

  console.log('/api/portcontrol/create called')

  // Ensure the user has a valid CSRF token
  // if (!security.csrf.validate(req)) {
  //  return res.apiError(403, 'invalid csrf');
  // }

  // var item = new DeviceModel.model();
  // var data = (req.method == 'POST') ? req.body : req.query;

  // Randomly generate username
  var username = randomString(10)

  // Randomly generate password
  var password = randomString(10)

  var data2 = {}
  data2.username = username
  data2.password = password

  // Get a port assignment
  // var port = getPort(req, data2);

  // Retrieve the list of used ports from the database.
  PortsUsedModel.model.find(function (err, items) {
    if (err) return res.apiError('database error', err)

    let newPort;

    // Handle new database by creating first entry.
    if (items.length === 0) {
      var item = new PortsUsedModel.model()
      var data = {}

      // item.set('usedPort', ["3000"]);
      data.usedPort = ['6000']
      item.getUpdateHandler(req).process(data, function (err) {
        if (err) return res.apiError('error', err)

        // return "3001";
      })

      newPort = '6001'
    } else {
      var portsModel = items[0]
      var portList = portsModel.get('usedPorts')
      var lastPort = portList[portList.length - 1]

      // Error Handling
      if (lastPort === undefined) lastPort = '6000'

      newPort = Number(lastPort) + 1
      newPort = newPort.toString()

      portList.push(newPort)
      portsModel.set('usedPorts', portList)
      portsModel.save()
    }

    data2.port = newPort

    res.apiResponse({
      newDevice: data2
    })
  })
}

// This function removes a port from the portControl array.
// The ID of the port to be released is passed in the URI.
exports.remove = function (req, res) {
  debugger;

  const port = req.params.id;

  // Retrieve the list of used ports from the database.
  PortsUsedModel.model.find(function (err, items) {
    debugger;

    if (err) return res.apiError('database error', err);

    // Handle new database by creating first entry.
    if (items.length === 0) {
      return res.apiError('Port Controll array is empty.', err);
    }

    // Get the first model in the list.
    var portsModel = items[0]
    var portList = portsModel.get('usedPorts')

    // Remove the port from the array.
    let newArray = portList.filter(e => e !== port);

    // Save changes to server.
    portsModel.set('usedPorts', newArray)
    portsModel.save()

    res.apiResponse({
      success: true
    });
  });
}

var randomString = function (length) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
