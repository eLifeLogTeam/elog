/**
 * Geospatial location model
 */
Ext.define('Elog.model.LocationModel', {
	extend: 'Ext.data.Model',
	xtype: 'elogLocationModel',
	config: {
		fields: [
	        {name: 'latitude', type: 'number'},
	        {name: 'longitude', type: 'number'},
	        {name: 'range', type: 'number'}
	    ]
	}
});
