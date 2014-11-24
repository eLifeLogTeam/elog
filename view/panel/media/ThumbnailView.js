/**
 * Image thumb ThumbnailView.
 * 
 * This is the combination of two xtypes {elogImageThumbnailView and elogImageSlideshow}.
 * 
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.ThumbnailView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.ThumbnailView', {
	extend: 'Ext.Panel',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.div.canvas.image.Thumbnail',
    ],
    xtype: 'elogImageThumbnailView',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	    	id: 'idChildImageThumbnailViewThumbnail',
    		xtype: 'elogImageThumbnail',
    	//	zIndex: 100
    	}]
    }
});
