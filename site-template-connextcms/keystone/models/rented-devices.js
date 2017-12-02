var keystone = require('keystone')
var Types = keystone.Field.Types

/**
 * This model is used to track the ports in use by the SSH container/server.
 * ==========
 */

var RentedDevices = new keystone.List('RentedDevices', {})

RentedDevices.add({
  rentedDevices: { type: Types.TextArray }
})

RentedDevices.defaultColumns = 'rentedDevices'
RentedDevices.register()
