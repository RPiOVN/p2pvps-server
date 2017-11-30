var keystone = require('keystone')
var Types = keystone.Field.Types

/**
 * Device Public Model
 * ==================
 */

var DevicePublicModel = new keystone.List('DevicePublicModel')

DevicePublicModel.add({
  ownerUser: { type: Types.Relationship, ref: 'User' },
  renterUser: { type: Types.Relationship, ref: 'User' },
  privateData: { type: Types.Relationship, ref: 'DevicePrivateModel' },
  obContract: { type: Types.Relationship, ref: 'obContractModel' },
  rentStartDate: { type: String },
  expiration: { type: String }, // Date client should be reset.
  deviceName: { type: String },
  deviceDesc: { type: String },
  rentHourlyRate: { type: String },
  subdomain: { type: String },
  httpPort: { type: String },
  sshPort: { type: String },
  memory: { type: String },
  diskSpace: { type: String },
  processor: { type: String },
  internetSpeed: { type: String },
  checkinTimeStamp: { type: String }
})

DevicePublicModel.defaultColumns = 'ownerUser'
DevicePublicModel.register()
