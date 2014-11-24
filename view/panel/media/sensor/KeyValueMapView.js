/**
 * Sensor data Key-value view with map supports.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.GpsPathThumbnailTimeline', {
 *     	fullscreen:true
 *     });
 *     
 */
Ext.define('Elog.view.panel.media.sensor.KeyValueMapView', {
    extend: 'Elog.view.panel.media.sensor.Base',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.map.gpscluster.GpsDataPath',
       'Ext.dataview.DataView'
    ],
    xtype: 'elogKeyValueMapView',
    config : {
	    cls: 'cards',
	    layout: {
	        type: 'vbox',
	        align: 'stretch',
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	        id: 'idChildGpsDataPath',
	        xtype: 'elogGpsDataPath'
	    },{
	        id: 'idChildSensorKeyValueDataView',
	        xtype: 'elogSensorKeyValueDataView'
	    }]
    },
    
    /**
     * Initialize
     */
    init: function() {
    	this.callParent();
    }
});
