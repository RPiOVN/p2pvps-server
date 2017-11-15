var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Device Public Model
 * ==================
 */

var obContractModel = new keystone.List('obContractModel');

obContractModel.add({
  clientDevice: { type: Types.Relationship, ref: 'DevicePublicModel' },
  ownerUser: { type: Types.Relationship, ref: 'User' },
  renterUser: { type: Types.Relationship, ref: 'User' },
  price: { type: Number },
  experation: { type: String },
  title: { type: String },
  description: { type: String },
  listingUri: : { type: String },
  imageHash: : { type: String },
  listingState: { type: String },
  createdAt: { type: String },
  updatedAt: { type: String }
});

obContractModel.defaultColumns = 'clientDevice';
obContractModel.register();
