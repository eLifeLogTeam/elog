/**
 * Elog controller: UIVideoManager
 * 
 */
Ext.define('Elog.controller.data.UIVideoManager', {
	extend: 'Elog.controller.data.UIManager',
    requires: [
       'Elog.controller.data.UIManager',
       'Ext.util.Droppable'
    ],
	config: {
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        // 'Elog.view.panel.media.sensor.CEPEditor',
		],
		/**
		 * When designing your own UIVideoManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			// UI Video View
            videoView: '#idElogVideoView',
            
            // Child Video item
            childVideoViewVideo: '#idChildVideoViewVideo',
            childVideoViewCoverFlow: '#idChildVideoViewCoverFlow',
        },

		control: {
            // UI Video Slideshow View
            videoView: {
            	initialize: 'onVideoViewInitialize',
            },
            childVideoViewVideo: {
            //	initialize: 'onInitChildVideoViewVideo',
            	timechange: 'onTimeChange',
            	timerangechange: 'onTimeRangeChange',
            },
            childVideoViewCoverFlow: {
            //	initialize: 'onInitChildVideoViewCoverFlow',
            	timechange: 'onTimeChange',
            },
		},
	},
    
    
    onTimeChange: function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
    	var oController = this;
    	
    	oController.putTimeChangeListener(oController.getChildTimeSliderToolbar());
    	
    	// Add listener
    	// UI Video View
    	oController.putTimeChangeListener(oController.getChildVideoViewVideo());
    	oController.putTimeChangeListener(oController.getChildVideoViewCoverFlow());
    	
    	// Distribute event to all UIs under control.
    	oController.getTimeChangeListeners().forEach(function(oTimeChangeListener) {
    		if (typeof oTimeChangeListener.onTimeChange != "undefined" &&
    			oTimeChangeListener.getItemId() != oEventConfig.caller.getItemId()) {
    			oTimeChangeListener.onTimeChange(oEventConfig);
    		}
    	});
    },
    
    /**
     * idChildTimeSliderToolbar is common to all UI. So this does not need to be reimplemented in the inherited class
     */
    onTimeRangeChange: function(oEventConfig) {
    	var oController = this;
    	
    	if (typeof oController.getChildTimeSliderToolbar() !== "undefined") {
    		oController.putTimeRangeChangeListener(oController.getChildTimeSliderToolbar());
    	}
    	oController.putTimeRangeChangeListener(oController.getChildVideoViewVideo());
    	
    	// Distribute event to all UIs under control.
    	oController.getTimeRangeChangeListeners().forEach(function(oTimeRangeChangeListener) {
    		if (typeof oTimeRangeChangeListener.onTimeRangeChange != "undefined" &&
    			oTimeRangeChangeListener.getItemId() != oEventConfig.caller.getItemId()) {
    			oTimeRangeChangeListener.onTimeRangeChange();
    		}
    	});
    },
    
    
	/** 
	 * When multiple child items need to be refreshed, then their parent function perform the search
	 */
    onVideoViewInitialize: function (oEvent, opts) {
    	var oController = this;
    	
    	// Set search call function
    	oController.setCurrentSearchFunction({
    		'function' : oController.onVideoViewInitialize,
    		'args' : oEvent
    	});
    	
    	// XXX Perform separated initialization because of different media type.
    	// TODO May come up with an idea to call server one time on composite media types
    	// TODO We have to use video posterUrl as the image source. 
    	var oChildVideoViewVideo = oController.getChildVideoViewVideo();
    	var oChildVideoViewCoverFlow = oController.getChildVideoViewCoverFlow();
    	
    	/*
    	if (oVideoViewVideo != null) {
    		oController.onInitChildVideoViewVideo(oEvent, opts);
    	}
    	
    	if (oChildVideoViewCoverFlow != null) {
    		oController.onInitChildVideoViewCoverFlow(oEvent, opts);
    	}
    	*/
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oMedia.getMediaList({
    		mediaType: 'video',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	thumbnailWidth: (oChildVideoViewCoverFlow.getThumbnailWidth() == null) ? null : oChildVideoViewCoverFlow.getThumbnailWidth(),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
            	oChildVideoViewVideo.loadData(oResult);
    		
        		/**
        		 * Perform time range search and prepare image list loading
        		 */
        		var oStartUnixtime = null;
        		var oEndUnixtime = null;
        		
        		if (oChildVideoViewVideo.getMediaList() == null) return;
        		
        		oChildVideoViewVideo.getMediaList().forEach(function(oVideo){
        			if (oStartUnixtime == null || oStartUnixtime > oVideo.startUnixtime) {
        				oStartUnixtime = oVideo.startUnixtime;
        			}
        			if (oEndUnixtime == null || oEndUnixtime < oVideo.endUnixtime) {
        				oEndUnixtime = oVideo.endUnixtime;
        			}
        			
        			// oVideo.mediaUrl = oVideo.posterUrl;
        			oVideo.image = oVideo.posterUrl;
		        });
		        
		        oChildVideoViewCoverFlow.onProcessImageList(oResult);
        		
            	// Set time range
		        if (oStartUnixtime != null && oEndUnixtime != null) {
		        	var oApiBase = new Elog.api.Base();
	        		oApiBase.setCookie("elogStartTime", new Date(oStartUnixtime*1000));
	            	oApiBase.setCookie("elogEndTime", new Date(oEndUnixtime*1000));
	            	
	            	// This should be changed to fire ElogEvent to synchronize timeslidertoolbar
	            	// oController.onTimeRangeChange();
	            	oChildVideoViewVideo.fireElogEvent({
	    				eventName: 'timerangechange', 
	    				eventConfig: {
	    					unixTimestamp: oStartUnixtime,
	    					caller: oChildVideoViewVideo,
	    				}
	    			});
		        }
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
});