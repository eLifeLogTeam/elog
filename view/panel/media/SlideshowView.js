/**
 * Image slideshow.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.SlideshowView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.SlideshowView', {
	extend: 'Ext.Panel',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.div.canvas.image.Slideshow',
    ],
    xtype: 'elogImageSlideshowView',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
    		id: 'idChildImageSlideshowViewSlideshow',
    		centered: true,
    		width: '100%',
    		height: '100%',
        	xtype: 'elogImageSlideshow',
    		// zIndex: 200
	    }]
    }
});
