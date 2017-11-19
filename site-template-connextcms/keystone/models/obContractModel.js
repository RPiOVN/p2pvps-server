var keystone = require("keystone");
var Types = keystone.Field.Types;

/**
 * OpenBazaar Contract Model
 * ==================
 */

var obContractModel = new keystone.List("obContractModel");

obContractModel.add({
  clientDevice: { type: Types.Relationship, ref: "DevicePublicModel" },
  ownerUser: { type: Types.Relationship, ref: "User" },
  renterUser: { type: Types.Relationship, ref: "User" },
  price: { type: Number },
  experation: { type: String },
  title: { type: String },
  description: { type: String },
  listingUri: { type: String }, // OB URI
  imageHash: { type: String }, // OB Image URI
  listingSlug: { type: String }, // OB listing slug
  listingState: { type: String },
  createdAt: { type: String },
  updatedAt: { type: String },
});

obContractModel.defaultColumns = "clientDevice";
obContractModel.register();
