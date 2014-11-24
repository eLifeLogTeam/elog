/**
 * eLifeLog API: Video
 * 
 * Video extension to use sensor data
 * 
 * ## Example
 *
 *     @example preview
 *     	Ext.create('Elog.view.ui.ext.Video', {
 *     });
 *     
 * TODO: Video load the first frame. Or else implement video poster server call  including it at the result returned by GetMediaList.
 * TODO: Creates a merged UI set using Video
 * TODO: Video timeline thumbnail slider would be needed. May modify image slideshow UI for this purpose.
 * 
 */
Ext.define('Elog.view.ui.ext.Video', {
    extend: 'Ext.Video',
    requires: [
       'Ext.Video'
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogVideo',
    config : {
    	autoPause: true,
		autoResume: false,
		loop: false,
		mediaList: null,
		currentMedia: null,
		
        listeners: {
	    	initialize: function() {
	    		
    		},
    		/** 
    		 * 'change' event fires when dragging stops
    		 */
    		timeupdate: function(oVideo, oTime, eOpts) {
    			// fireEvent
    			if (this.getCurrentMedia() == null) return;
    			var oPlayUnixTime = parseInt(parseInt(this.getCurrentMedia().startUnixtime) + oTime);
    			this.setCurrentUnixTimestamp(oPlayUnixTime);
    			this.fireElogEvent({
    				eventName: 'timechange', 
    				eventConfig: {
    					unixTimestamp: oPlayUnixTime,
    					caller: this,
    				}
    			});
    		},
		}
    },
    
    onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
    	if (parseInt(this.getCurrentUnixTimestamp()) != oUnixTimestamp) {
    		this.setCurrentUnixTimestamp(oUnixTimestamp);
        
	        var oViewer = this;
	        
	        // Find video 
	        var oIsPlay = oViewer.isPlaying();
	        // if (oIsPlay) oViewer.stop();
	        
	        if (oViewer.getMediaList() == null) return;
	        
	        var oLatestVideoId = null;
	        
	        oViewer.getMediaList().forEach(function(oVideo, videoId){
	        	if (oUnixTimestamp >= parseInt(oVideo.startUnixtime)) {
	        		oLatestVideoId = videoId;
        		}
	        });
	        
	        if (oLatestVideoId != null) {
	        	oViewer.setCurrentMedia(oViewer.getMediaList()[oLatestVideoId]);
    			oViewer.setUrl(oViewer.getMediaList()[oLatestVideoId].mediaUrl);
    			oViewer.setPosterUrl(oViewer.getMediaList()[oLatestVideoId].posterUrl);
	        }		
    	}
    },
    
    /**
     * laodData. Created for the compatibility
     * @param {} data
     */
    loadData: function(data) {
    	var oViewer = this;
        if (data && data.root && !!data.root.length) {
            oViewer.setMediaList(data.root);
            
            // Load the first video
            if (Array.isArray(oViewer.getMediaList()) && oViewer.getMediaList().length > 0) {
            	// Parse string to integer unixtime
            	oViewer.getMediaList().forEach(function(oVideo){
		        	oVideo.startUnixtime = parseInt(oVideo.startUnixtime);
		        	oVideo.endUnixtime = parseInt(oVideo.endUnixtime);
		        	oVideo.unixtimestamp = parseInt(oVideo.unixtimestamp);
		        });
		        
            	oViewer.setUrl(oViewer.getMediaList()[0].mediaUrl);
            	oViewer.setPosterUrl(oViewer.getMediaList()[0].posterUrl);
            	oViewer.setCurrentMedia(oViewer.getMediaList()[0]);
            	
            	/*
            	oViewer.fireElogEvent({
    				eventName: 'timechange',
    				eventConfig: {
    					unixTimestamp: parseInt(oViewer.getCurrentMedia().startUnixtime),
    					caller: oViewer,
    				}
    			});
    			*/
            }
        }
    },
    
});