/**
 * Geospatial location data store
 * 
 * @author pilhokim
 * 
 */
Ext.define('Elog.store.CEPNestedListStore', {
    extend: 'Ext.data.TreeStore',
    xtype: 'elogCEPNestedListStore',
    require: [
      'Elog.model.CEPNestedListModel',
      'Ext.data.proxy.LocalStorage'
	],
    config: {
    	model: 'Elog.model.CEPNestedListModel',
        // sorters: 'eml_event_timestamp',
		sorters: 'sensorName',
		defaultRootProperty: 'childSensors',
		root: {},
		idProperty: 'sensorName',
	    // identifier: 'uuid',
    }
});