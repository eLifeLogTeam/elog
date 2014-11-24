/**
 * @author pilhokim
 * 
 */
Ext.define('Elog.store.SensorKeyValueStore', {
    extend: 'Ext.data.Store',
    xtype: 'elogSensorKeyValueStore',
    require: [
      'Elog.model.SensorKeyValueModel',
      'Ext.data.proxy.LocalStorage'
	],
    config: {
    	model: 'Elog.model.SensorKeyValueModel',
        sorters: 'eml_event_timestamp',
		root: {},
    }
});