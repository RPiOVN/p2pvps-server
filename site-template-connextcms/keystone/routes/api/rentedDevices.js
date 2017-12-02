const keystone = require('keystone')

const RentedDevices = keystone.list('RentedDevices')

/*
  Add deviceId to the list of rented devices.
*/
exports.add = function (req, res) {
  // debugger

  // const deviceId = req.method === 'POST' ? req.body : req.query
  const deviceId = req.params.id

  if (deviceId === undefined || deviceId === '') res.apiError('invalid ID')

  // Retrieve the list of rented devices from the database.
  RentedDevices.model.find(function (err, items) {
    // debugger
    if (err) return res.apiError('database error', err)

    // Handle new database by creating first entry.
    if (items.length === 0) {
      var item = new RentedDevices.model()
      var data = {}

      data.rentedDevices = [deviceId]
      item.getUpdateHandler(req).process(data, function (err) {
        if (err) return res.apiError('error', err)
      })
    } else {
      const rentedDevicesModel = items[0]
      let rentedDevicesList = rentedDevicesModel.get('rentedDevices')

      // Prevent duplicates. Remove the device from the list in case is already exists.
      let newArray = rentedDevicesList.filter(i => i !== deviceId)

      newArray.push(deviceId)
      rentedDevicesModel.set('rentedDevices', newArray)
      rentedDevicesModel.save()
    }

    res.apiResponse({
      success: true
    })
  })
}

/**
 * Remove a deviceId from the rented devices list.
 */
exports.remove = function (req, res) {
  try {
    // debugger

    // const deviceId = req.method === 'POST' ? req.body : req.query
    const deviceId = req.params.id

    if (deviceId === undefined || deviceId === '') res.apiError('invalid ID')

    // Retrieve the list of rented devices from the database.
    RentedDevices.model.find(function (err, items) {
      // debugger
      if (err) return res.apiError('database error', err)

      if (items.length === 0) {
        res.apiError('list is empty')
      } else {
        const rentedDevicesModel = items[0]
        let rentedDevicesList = rentedDevicesModel.get('rentedDevices')

        // Remove the deviceId from the array.
        let newArray = rentedDevicesList.filter(i => i !== deviceId)
        // Source: https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value

        rentedDevicesModel.set('rentedDevices', newArray)
        rentedDevicesModel.save()
      }

      res.apiResponse({
        success: true
      })
    })
  } catch (err) {
    debugger
    return res.apiError('error', err)
  }
}
