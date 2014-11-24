/**
 * FaceThumbnailView.
 * 
 * This is the combination of two xtypes {elogImageThumbnail}.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.FaceThumbnailView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.FaceThumbnailView', {
	extend: 'Ext.Panel',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.div.canvas.image.FaceThumbnail',
    ],
    xtype: 'elogFaceThumbnailView',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	    	id: 'idChildFaceThumbnailViewThumbnail',
    		xtype: 'elogFaceThumbnail',
    	//	zIndex: 100
    	}]
    }
});
