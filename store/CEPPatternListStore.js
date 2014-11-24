/**
 * CEPNestedListStore
 * 
 * @author pilhokim
 * 
 */
Ext.define('Elog.store.CEPPatternListStore', {
    extend: 'Ext.data.Store',
    xtype: 'elogCEPPatternListStore',
    require: [
      'Elog.model.CEPPatternModel',
      'Ext.data.proxy.LocalStorage'
	],
    config: {
    	model: 'Elog.model.CEPPatternModel',
        sorters: 'sensorName',
		root: {},
		idProperty: 'sensorName',
    }
});