/**
 * Geospatial location model
 */
Ext.define('Elog.model.SensorKeyValueModel', {
	extend: 'Ext.data.Model',
	xtype: 'elogSensorKeyValueModel',
	config: {
		// idProperty: 'sensor', // XXX This is a unique identifier
		// identifier: 'uuid',
		fields: [{
			name: 'sensor',
			type: 'string',
		},{
			name: 'eml_event_timestamp',
			type: 'string',
		},{
			name: 'unixtimestamp',
			type: 'string',
		},{
			name: 'newEvent',
			type: 'auto',
		},{
			name: 'oldEvent',
			type: 'auto',
		},{
			name: 'reportStatus',
			type: 'string',
		},{
			name: 'status',
			type: 'string',
		},{
			name: 'iconDiv',
			type: 'string',
		}]
	}
});
