/**
 * Geospatial location model
 */
Ext.define('Elog.model.CEPNestedListModel', {
	extend: 'Ext.data.Model',
	xtype: 'elogCEPNestedListModel',
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
		}]
	}
});
