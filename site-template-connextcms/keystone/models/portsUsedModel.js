var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * This model is used to track the ports in use by the SSH container/server.
 * ==========
 */

var PortsUsedModel = new keystone.List('PortsUsedModel', {});

PortsUsedModel.add({
  usedPorts: { type: Types.TextArray }
});


PortsUsedModel.defaultColumns = 'usedPorts';
PortsUsedModel.register();