/**
 * Path finder between two GPS clusters with the thumbnail timeline view support
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
Ext.define('Elog.view.panel.media.GpsPathThumbnailTimeline', {
    extend: 'Elog.view.panel.Base',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.map.gpscluster.Path',
       'Elog.view.panel.media.ThumbnailTimelineView'
    ],
    xtype: 'elogGpsPathThumbnailTimeline',
    config : {
	    cls: 'cards',
	    layout: {
	        type: 'hbox',
	        align: 'stretch',
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	        id: 'idChildGpsPath',
	        xtype: 'elogGpsClusterPath'
	    },{
	        id: 'idChildThumbnailTimeline',
	        xtype: 'elogThumbnailTimeline'
	    }]
    }
});
