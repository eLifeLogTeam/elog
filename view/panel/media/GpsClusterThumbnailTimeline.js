/**
 * GPS cluster viewer with the thumbnail timeline viewer
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.GpsClusterThumbnailTimeline', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.GpsClusterThumbnailTimeline', {
    extend: 'Ext.Panel',
    mixins: ['Elog.view.ui.Mixin'],
    requires: [
       'Ext.Panel',
       'Elog.view.ui.map.gpscluster.Base',
       'Elog.view.ui.panel.div.timeline.SimileTimeline' 
    ],
    xtype: 'elogGpsClusterThumbnailTimeline',
    config : {
	    cls: 'cards',
	    layout: {
	        type: 'hbox',
	        align: 'stretch',
	    },
	    defaults: {
	        flex: 1,
	    },
	    items: [{
	        id: 'idChildGpsClusterThumbnailTimelineGpsCluster',
	        xtype: 'elogGpsCluster',
	    },{
	    	id: 'idChildGpsClusterThumbnailTimelineSimileTimeline',
	        xtype: 'elogSimileTimeline',
	        bandAdjustMode: 'start',
	        timezone: '+2',
	    }]
    }
});
