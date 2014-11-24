/**
 * @author pilhokim
 * 
 */
Ext.define('Elog.store.CEPListStore', {
    extend: 'Ext.data.Store',
    xtype: 'elogCEPListStore',
    require: [
      'Elog.model.CEPPatternModel',
      'Ext.data.proxy.LocalStorage'
	],
    config: {
    	model: 'Elog.model.CEPPatternModel',
        sorters: 'eml_event_timestamp',
		// sorters: 'sensorName',
		root: {},
		idProperty: 'sensorName',
	    // identifier: 'uuid',
    }
});