/**
 * GPS cluster viewer with the thumbnail  viewer
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.GpsClusterThumbnailView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.GpsClusterThumbnailView', {
    extend: 'Ext.Panel',
    mixins: ['Elog.view.ui.Mixin'],
    requires: [
       'Ext.Panel',
       'Elog.view.ui.map.gpscluster.Base',
    //   'Elog.view.ui.panel.div.canvas.image.Thumbnail',
       'Elog.view.ui.panel.div.canvas.image.SingleImageThumbnail',
    ],
    xtype: 'elogGpsClusterThumbnailView',
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
	        id: 'idChildGpsClusterThumbnailViewGpsCluster',
	        xtype: 'elogGpsCluster',
	    },{
	    	id: 'idChildGpsClusterThumbnailViewThumbnail',
    		// xtype: 'elogImageThumbnail',
    		xtype: 'elogSingleImageThumbnail',
    		// zIndex: 10
    	}]
    }
});
