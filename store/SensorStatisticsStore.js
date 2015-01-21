/**
 * @author pilhokim
 * 
 */
Ext.define('Elog.store.SensorStatisticsStore', {
    extend: 'Ext.data.Store',
    xtype: 'elogSensorStatisticsStore',
    require: [
      'Elog.model.SensorStatisticsModel',
      'Ext.data.proxy.LocalStorage'
	],
    config: {
    	model: 'Elog.model.SensorStatisticsModel',
        sorters: 'unixtimestamp',
		root: {},
    }
});