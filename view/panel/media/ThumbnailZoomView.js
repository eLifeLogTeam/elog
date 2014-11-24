/**
 * Image thumbnail zoom view.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.ThumbnailZoomView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.ThumbnailZoomView', {
	extend: 'Ext.Panel',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.div.canvas.image.ThumbnailZoom',
    ],
    xtype: 'elogImageThumbnailZoomView',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
    		id: 'idChildImageThumbnailZoom',
    		centered: true,
    		width: '100%',
    		height: '100%',
        	xtype: 'elogImageThumbnailZoom',
    		zIndex: 200
	    }]
    }
});
