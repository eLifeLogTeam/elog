/**
 * Video GPS path with the thumbnail  viewer
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.VideoGpsPathThumbnailView', {
 *     	fullscreen:true
 *     });
 * 
 * TODO: Add Video Path, Video Image (Thumbnail Slideshow), Video Path views too. (26 Sep 2014)
 */
Ext.define('Elog.view.panel.media.VideoGpsPathThumbnailView', {
    extend: 'Ext.Panel',
    mixins: ['Elog.view.ui.Mixin'],
    requires: [
       'Ext.Panel',
       'Elog.view.ui.map.gpscluster.GpsDataPath',
       'Elog.view.ui.panel.div.canvas.image.Thumbnail',
       'Elog.view.ui.ext.Video',
       'Elog.view.ui.panel.CoverFlow',
    ],
    xtype: 'elogVideoGpsPathThumbnailView',
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
	        layout: {
				type: 'vbox',
				align: 'stretch',
			},
	        items: [{
    			id: 'idChildVideoGpsPathThumbnailViewVideo',
	    	//	centered: true,
	    	//	width: '100%',
	    	//	height: '100%',
	        	xtype: 'elogVideo',
	    	//	zIndex: 200,
	    		flex: 5,
		    },{
		        layout: {
			        type: 'hbox',
			        align: 'stretch'
			    },
			    flex: 2,
			    defaults: {
			        flex: 1
			    },
			    items: [{
		    		id: 'idChildVideoGpsPathThumbnailViewCoverFlow',
		    		xtype: 'elogCoverFlow',
		    		width: '100%',
					height: '100%',
					flat: true,
		    	}]
	    	}]
	    },{
		    cls: 'cards',
		    layout: {
		        type: 'vbox',
		        align: 'stretch',
		    },
		    defaults: {
		        flex: 1,
		    },
		    items: [{
		    	id: 'idChildVideoGpsPathThumbnailViewThumbnail',
	    		xtype: 'elogImageThumbnail',
	    		zIndex: 100
	    	},{
		        id: 'idChildVideoGpsPathThumbnailViewGpsPath',
		        xtype: 'elogGpsDataPath',
		    }]
	    }]
    }
});
