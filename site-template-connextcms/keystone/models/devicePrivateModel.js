var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Device Private Model
 * ==================
 */

var DevicePrivateModel = new keystone.List('DevicePrivateModel');

DevicePrivateModel.add({
  ownerUser: { type: Types.Relationship, ref: 'User' },
  renterUser: { type: Types.Relationship, ref: 'User' },
  publicData: { type: Types.Relationship, ref: 'DevicePublicModel' },
  serverSSHPort: { type: String },
  deviceUser: { type: String },
  devicePassword: { type: String }
});

User.defaultColumns = 'ownerUser';
DevicePrivateModel.register();
