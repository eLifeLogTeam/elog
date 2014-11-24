/**
 * Image thumb ThumbnailSlideshow.
 * 
 * This is the combination of two xtypes {elogImageThumbnailView and elogImageSlideshow}.
 * 
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.ThumbnailSlideshowView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.ThumbnailSlideshowView', {
	extend: 'Ext.Panel',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.div.canvas.image.Thumbnail',
       'Elog.view.ui.panel.div.canvas.image.Slideshow',
    ],
    xtype: 'elogImageThumbnailSlideshow',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	    	id: 'idChildThumbnailSlideshowThumbnail',
    		xtype: 'elogImageThumbnail',
    		// zIndex: 100
    	},{
    		id: 'idChildThumbnailSlideshowSlideshow',
    		centered: true,
    		width: 640,
    		height: 480,
        	xtype: 'elogImageSlideshow',
    		zIndex: 100
	    }]
    }
});
