/**
 * Single image thumbnail viewer
 * 
 * This is the combination of two xtypes {elogImageSingleImageThumbnailView and elogImageSlideshow}.
 * 
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.SingleImageThumbnailView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.SingleImageThumbnailView', {
	extend: 'Ext.Panel',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.div.canvas.image.SingleImageThumbnail',
    ],
    xtype: 'elogSingleImageThumbnailView',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	    	id: 'idChildSingleImageThumbnailViewThumbnail',
    		xtype: 'elogSingleImageThumbnail',
    	//	zIndex: 100
    	}]
    }
});
