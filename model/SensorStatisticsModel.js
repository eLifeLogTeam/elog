/**
 * Sensor statistics data model
 */
Ext.define('Elog.model.SensorStatisticsModel', {
	extend: 'Ext.data.Model',
	xtype: 'elogSensorStatisticsModel',
	config: {
		fields: [{
			name: 'sa_year',
			type: 'number',
		},{
			name: 'sa_month',
			type: 'number',
		},{
			name: 'sa_day',
			type: 'number',
		},{
			name: 'sensor',
			type: 'string',
		},{
			name: 'dataCount',
			type: 'number',
		},{
			name: 'sa_startTimestamp',
			type: 'string',
		},{
			name: 'sa_endTimestamp',
			type: 'string',
		},{
			name: 'startUnixtime',
			type: 'number',
		},{
			name: 'endUnixtime',
			type: 'number',
		},{
			name: 'imageDataURI',
			type: 'string',
		},{
			name: 'iconDiv',
			type: 'string',
		}]
	}
});
