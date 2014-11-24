/**
 * Geospatial location data store
 * 
 * @author pilhokim
 * 
 */
Ext.define('Elog.store.LocationStore', {
    extend: 'Ext.data.Store',
    xtype: 'elogLocationStore',
    require: [
      'Elog.model.LocationModel',
      'Ext.data.proxy.LocalStorage'
	],
    config: {
    	model: 'Elog.model.LocationModel',
        proxy: {
            id: 'idElogSearchLocationConfig',
            type: 'localstorage'
        }
    }
});