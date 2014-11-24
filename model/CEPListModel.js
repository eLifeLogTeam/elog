/**
 * Geospatial location model
 */
Ext.define('Elog.model.CEPListModel', {
	extend: 'Ext.data.Model',
	xtype: 'elogCEPListModel',
	config: {
		idProperty: 'sensorName',
		identifier: 'uuid',
		fields: [{
			name: 'sensorName',
			type: 'string',
		},{
			name: 'inputSensors',
			type: 'string',
		},{
			name: 'query',
			type: 'string',
		},{
			name: 'eml_event_timestamp',
			type: 'string',
		},{
			name: 'iconDiv',
			type: 'string',
		},{
			name: 'childSensors',
			type: 'array',
		}]
	}
});
