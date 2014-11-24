/**
 * GPS path with the thumbnail  viewer
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.GpsPathThumbnailView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.GpsPathThumbnailView', {
    extend: 'Ext.Panel',
    mixins: ['Elog.view.ui.Mixin'],
    requires: [
       'Ext.Panel',
       'Elog.view.ui.map.gpscluster.GpsDataPath',
       'Elog.view.ui.panel.div.canvas.image.Thumbnail' 
    ],
    xtype: 'elogGpsPathThumbnailView',
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
	        id: 'idChildGpsPathThumbnailViewGpsPath',
	        xtype: 'elogGpsDataPath',
	    },{
	    	id: 'idChildGpsPathThumbnailViewThumbnail',
    		xtype: 'elogImageThumbnail',
    		zIndex: 100
    	}]
    }
});
