/**
 * Gps Cluster View.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.GpsClusterView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.GpsClusterView', {
	extend: 'Ext.Panel',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.map.gpscluster.Base',
    ],
    xtype: 'elogGpsClusterView',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	    	id: 'idChildGpsClusterViewGpsCluster',
    		xtype: 'elogGpsCluster'
    	}]
    }
});
