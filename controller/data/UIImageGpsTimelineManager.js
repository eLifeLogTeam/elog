/**
 * Elog controller: UIManager
 * 
 */
Ext.define('Elog.controller.data.UIImageGpsTimelineManager', {
	extend: 'Elog.controller.data.UIManager',
    requires: [
       'Elog.controller.data.UIManager',
       'Elog.api.media.GpsManager',
       'Ext.util.Droppable',
       'Elog.view.panel.media.GpsClusterThumbnailView',
       'Elog.view.panel.media.GpsPathThumbnailView',
       'Elog.view.panel.media.VideoGpsPathThumbnailView',
       'Elog.view.panel.media.ThumbnailTimelineView',
    ],
	config: {
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        // 'Elog.view.panel.media.sensor.CEPEditor',
		],
		/**
		 * When designing your own UIManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			// UI ElogThumbnailTimeline
            thumbnailTimelineView: '#idElogThumbnailTimelineView',
            childThumbnailTimelineSimileTimeline: '#idChildThumbnailTimelineSimileTimeline',
			childThumbnailTimelineThumbnail: '#idChildThumbnailTimelineThumbnail',
            
            // UI ElogGpsClusterThumbnailView
            gpsClusterThumbnailView: '#idElogGpsClusterThumbnailView',
            childGpsClusterThumbnailViewGpsCluster: '#idChildGpsClusterThumbnailViewGpsCluster',
            childGpsClusterThumbnailViewThumbnail: '#idChildGpsClusterThumbnailViewThumbnail',
            
            // UI ElogGpsPathThumbnailView
            gpsPathThumbnailView: '#idElogGpsPathThumbnailView',
            childGpsPathThumbnailViewGpsPath: '#idChildGpsPathThumbnailViewGpsPath',
            childGpsPathThumbnailViewThumbnail: '#idChildGpsPathThumbnailViewThumbnail',
            
            // UI ElogVideoGpsPathThumbnailView
            videoGpsPathThumbnailView: '#idElogVideoGpsPathThumbnailView',
            childVideoGpsPathThumbnailViewGpsPath: '#idChildVideoGpsPathThumbnailViewGpsPath',
            childVideoGpsPathThumbnailViewThumbnail: '#idChildVideoGpsPathThumbnailViewThumbnail',
            childVideoGpsPathThumbnailViewVideo: '#idChildVideoGpsPathThumbnailViewVideo',
            childVideoGpsPathThumbnailViewCoverFlow: '#idChildVideoGpsPathThumbnailViewCoverFlow',
        },

		control: {
            // UI Image Thumbnail Timeline View
            thumbnailTimelineView: {
        		initialize: 'onInitThumbnailTimelineView',
            },
            childThumbnailTimelineSimileTimeline: {
            	initdiv: 'onInitChildThumbnailTimelineSimileTimeline',
                showbubble: 'onChildThumbnailTimelineSimileTimelineShowBubble',
            	timechange: 'onTimeChange',
            	hide: 'onChildThumbnailTimelineSimileTimelineHide',
            },
            childThumbnailTimelineThumbnail: {
            //	initdiv: 'onInitChildThumbnailTimelineThumbnail',
            	timechange: 'onTimeChange',
            },
            
            // UI ElogGpsClusterThumbnailView
            gpsClusterThumbnailView: {
            	// Init GPS
                initialize: 'onInitGpsClusterThumbnailView',
            },
            childGpsClusterThumbnailViewGpsCluster: {
            //    showinfo: 'onChildGpsClusterThumbnailViewGpsClusterShowInfo',
            //    regionclick: 'onSelectChildGpsClusterThumbnailViewGpsCluster',
            	timechange: 'onTimeChange',
            },
            childGpsClusterThumbnailViewThumbnail: {
            	// Init Thumbnail
            	timechange: 'onTimeChange',
            //	initdiv: 'onInitChildGpsClusterThumbnailViewThumbnail',
            	initdiv: 'onInitChildGpsClusterSingleImageThumbnailViewThumbnail',
            },
            
            // UI ElogGpsPathThumbnailView
            gpsPathThumbnailView: {
            	// Init GPS
                initialize: 'onInitGpsPathThumbnailView',
            },
            childGpsPathThumbnailViewGpsPath: {
            //    showinfo: 'onChildGpsPathThumbnailViewGpsPathShowInfo',
            //    regionclick: 'onSelectChildGpsPathThumbnailViewGpsPath',
            	timechange: 'onTimeChange',
            },
            childGpsPathThumbnailViewThumbnail: {
            	// Init Thumbnail
            	timechange: 'onTimeChange',
            //	initdiv: 'onInitChildGpsPathThumbnailViewThumbnail',
            	initdiv: 'onInitChildGpsPathSingleImageThumbnailViewThumbnail',
            },
            
            // UI ElogVideoGpsPathThumbnailView
            videoGpsPathThumbnailView: {
            	// Init GPS
                initialize: 'onInitVideoGpsPathThumbnailView',
            },
            childVideoGpsPathThumbnailViewGpsPath: {
            //    showinfo: 'onChildVideoGpsPathThumbnailViewVideoGpsPathShowInfo',
            //    regionclick: 'onSelectChildVideoGpsPathThumbnailViewVideoGpsPath',
            	timechange: 'onTimeChange',
            },
            childVideoGpsPathThumbnailViewThumbnail: {
            	// Init Thumbnail
            	timechange: 'onTimeChange',
            //	initdiv: 'onInitChildVideoGpsPathThumbnailViewThumbnail',
            	initdiv: 'onInitChildVideoGpsPathSingleImageThumbnailViewThumbnail',
            },// UI Video Slideshow View
            childVideoGpsPathThumbnailViewVideo: {
            	timechange: 'onTimeChange',
            	timerangechange: 'onTimeRangeChange',
            },
            childVideoGpsPathThumbnailViewCoverFlow: {
            	timechange: 'onTimeChange',
            },
            
		},
	},
	
	
    onTimeChange: function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
    	var oController = this;
    	
    	oController.putTimeChangeListener(oController.getChildTimeSliderToolbar());
    	
    	// UI Image Thumbnail Timeline View
    	oController.putTimeChangeListener(oController.getChildThumbnailTimelineSimileTimeline());
    	oController.putTimeChangeListener(oController.getChildThumbnailTimelineThumbnail());
    	
    	// UI ElogGpsClusterThumbnailView
  		oController.putTimeChangeListener(oController.getChildGpsClusterThumbnailViewGpsCluster());
    	oController.putTimeChangeListener(oController.getChildGpsClusterThumbnailViewThumbnail());
      	
    	// UI ElogGpsPathThumbnailView
    	oController.putTimeChangeListener(oController.getChildGpsPathThumbnailViewGpsPath());
    	oController.putTimeChangeListener(oController.getChildGpsPathThumbnailViewThumbnail());
    
    	// UI ElogVideoGpsPathThumbnailView
    	oController.putTimeChangeListener(oController.getChildVideoGpsPathThumbnailViewGpsPath());
    	oController.putTimeChangeListener(oController.getChildVideoGpsPathThumbnailViewThumbnail());
    	oController.putTimeChangeListener(oController.getChildVideoGpsPathThumbnailViewVideo());
    	oController.putTimeChangeListener(oController.getChildVideoGpsPathThumbnailViewCoverFlow());
    	
    	// Distribute event to all UIs under control.
    	oController.getTimeChangeListeners().forEach(function(oTimeChangeListener) {
    		if (typeof oTimeChangeListener.onTimeChange != "undefined" &&
    			oTimeChangeListener.getItemId() != oEventConfig.caller.getItemId()) {
    			oTimeChangeListener.onTimeChange(oEventConfig);
    		}
    	});
    },
	
    // UI Image Thumbnail Timeline View
    onInitThumbnailTimelineView: function(oEvent, opts) {
    	var oController = this;
    	
    	// Add listener
    },
    
    onInitChildThumbnailTimelineSimileTimeline: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildThumbnailTimelineSimileTimeline,
    		'args' : oEvent
    	});
    	
    	// Check whether the child UIs are initialized
    	if (oEvent.element.getWidth() === null ||
    		oEvent.element.getWidth() < 10) return;
    		
    	var oUtil = Ext.create('Elog.api.analysis.Cluster');
    	var oMedia = Ext.create('Elog.api.media.Base');
		
		var oController = this;
		var oSimilleTimeline = oController.getChildThumbnailTimelineSimileTimeline();
    	var oThumbnail = oController.getChildThumbnailTimelineThumbnail();
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	var oReturnResult = oMedia.getMediaList({
    		params: {
    			mediaType: 'image',
	        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
	        	timeTo: Math.round(oTimeTo.getTime()/1000),
	        	width: (oThumbnail.getThumbnailWidth() == null) ? 
	        		null : 
	        		oController.getChildThumbnailTimelineThumbnail().getThumbnailWidth()*2,
    		},
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	width: (oThumbnail.getThumbnailWidth() == null) ? 
        		null : 
        		oController.getChildThumbnailTimelineThumbnail().getThumbnailWidth()*2,
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
        		var oSimileResult = oUtil.parseEvents(oResult);
        		oSimilleTimeline.onLoadSource(oSimileResult);
    			
    			oThumbnail.onProcessImageList(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Image thumbnail viewer initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @deprecated
     * @return {Object|Boolean} 
     */
    onChildThumbnailTimelineSimileTimelineShowBubble: function (oEvent, opts) {
    	var oController = this;
    	var oSimilleTimeline = oController.getChildThumbnailTimelineSimileTimeline();
    	var oThumbnail = oController.getChildThumbnailTimelineThumbnail();
		
		var oMedia = Ext.create('Elog.api.media.Base');
		var oTimeFrom = oEvent.evt._start;
		var oTimeTo = oEvent.evt._end;
		
		// This routine can be changed with fireElogEvent('timechange');
    	var oReturnResult = oThumbnail.onSelectTimeRange(oTimeFrom, oTimeTo);
    },
    
    /**
     * Detach user input listeneres when hiding it
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     */
    onChildThumbnailTimelineSimileTimelineHide: function (oEvent, opts) {
    	var oThumbnailView = this.getChildImageThumbnailView();
    	
    	if (typeof oThumbnailView.detachInputListener !== 'undefined') {
    		oThumbnailView.detachInputListener(
				oThumbnailView
	        );
    	}
    },
    
    // UI ElogGpsClusterThumbnailView
    onInitGpsClusterThumbnailView: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitGpsClusterThumbnailView,
    		'args' : oEvent
    	});
    	
    	// Add listener
    	var oController = this;
    	
    	var oGpsCluster = oController.getChildGpsClusterThumbnailViewGpsCluster();
		
		var oGpsController = Ext.create('Elog.api.media.GpsManager');
    	
    	var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
		// Calculate the map boundary
		oGpsCluster.getMapBoundary();
		
    	var oReturnResult = oGpsController.getGpsCluster({
    		mediaType: 'gps',
    		minRadius: oGpsCluster.getMinRadius(),
    		maxRadius: oGpsCluster.getMaxRadius(),
            mapCenter: oGpsCluster.getMapCenter(),
            mapBounds: oGpsCluster.getMapBounds(),
            // timeFrom: oTimeFrom,
            // timeTo: oTimeTo,
        	timeFrom: Math.round(oTimeFrom.getTime()/1000),
        	timeTo: Math.round(oTimeTo.getTime()/1000),
            samplingSecond: 10,
        	onSuccess: function(oResult) {
        		if (typeof oResult.result !== "undefined") {
        			oController.attachResult(oResult.result);
        		}
        		
        		if (oResult) {
        			// oGpsCluster.onProcessGpsRegion(oResult);
        			var result = oGpsCluster.loadData(oResult);
        		}
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
        
        // Initialize thumbnail view
        var oChildGpsClusterThumbnailViewThumbnail = oController.getChildGpsClusterThumbnailViewThumbnail();
		
        if (oChildGpsClusterThumbnailViewThumbnail != null) {
        //	this.onInitChildGpsPathThumbnailViewThumbnail(oEvent, opts);
        	this.onInitChildGpsClusterSingleImageThumbnailViewThumbnail(oEvent, opts);
        }
    },
    
    /**
     * Image slideshow initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildGpsClusterThumbnailViewThumbnail: function (oEvent, opts) {
    	// Set search call function
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	var oReturnResult = oMedia.getMediaList({
    		params: {
	    		mediaType: 'image',
	        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
	        	timeTo: Math.round(oTimeTo.getTime()/1000),
    			// width: (oEvent.getThumbnailWidth() == null) ? null : oEvent.getThumbnailWidth()*2,
        	},
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.getChildGpsClusterThumbnailViewThumbnail().onProcessImageList(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    
    /**
     * Image slideshow initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildGpsClusterSingleImageThumbnailViewThumbnail: function (oEvent, opts) {
    	// Set search call function
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildGpsClusterThumbnailViewThumbnail = oController.getChildGpsClusterThumbnailViewThumbnail();
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
		oController.loadSingleImageThumbnailViewData(oController, oChildGpsClusterThumbnailViewThumbnail, oTimeFrom, oTimeTo);
	},
    
    // UI ElogGpsPathThumbnailView
    onInitGpsPathThumbnailView: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitGpsPathThumbnailView,
    		'args' : oEvent
    	});
    	
    	// Add listener
    	var oController = this;
    	var oGpsPath = oController.getChildGpsPathThumbnailViewGpsPath();
		
    	var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	// TODO: Here it should initialize all child elements
    	
    	// Initialize map view
    	
    	// var oMedia = Ext.create('Elog.api.media.SensorKeyValueManager');
		var oManager = this.getSensorManager();
		
		// Calculate the map boundary
		oGpsPath.getMapBoundary();
		
    	var oReturnResult = oManager.getSensorDatabyTimeSpan({
    		// TODO Below media type should be 'sensor' not 'android'
    		mediaType: 'android',
    		sensors: '%GPSLocationEvent',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000),
        	timeTo: Math.round(oTimeTo.getTime()/1000),
            samplingSecond: 10,
			maxCount: 1000,
        	onSuccess: function(oResult) { 
        		oController.attachResult(oResult.result);
        		
    			var result = oGpsPath.loadData(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
        
        // Initialize thumbnail view
        var oChildGpsPathThumbnailViewThumbnail = oController.getChildGpsPathThumbnailViewThumbnail();
		
        if (oChildGpsPathThumbnailViewThumbnail != null) {
        //	this.onInitChildGpsPathThumbnailViewThumbnail(oEvent, opts);
        	this.onInitChildGpsPathSingleImageThumbnailViewThumbnail(oEvent, opts);
        }
    },
    
    /**
     * Image thumbnail initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildGpsPathThumbnailViewThumbnail: function (oEvent, opts) {
    	// Set search call function
    	/*
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildImageThumbnailViewThumbnail,
    		'args' : oEvent
    	});
    	*/
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildGpsPathThumbnailViewThumbnail = oController.getChildGpsPathThumbnailViewThumbnail();
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	var oReturnResult = oMedia.getMediaList({
    		params: {
    			mediaType: 'image',
	        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
	        	timeTo: Math.round(oTimeTo.getTime()/1000),
	        	// width: (oEvent.getThumbnailWidth() == null) ? null : oEvent.getThumbnailWidth()*2,
	        },
    		onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		oChildGpsPathThumbnailViewThumbnail.onProcessImageList(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    
    /**
     * Image thumbnail initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildGpsPathSingleImageThumbnailViewThumbnail: function (oEvent, opts) {
    	// Set search call function
    	/*
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildImageThumbnailViewThumbnail,
    		'args' : oEvent
    	});
    	*/
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildGpsPathThumbnailViewThumbnail = oController.getChildGpsPathThumbnailViewThumbnail();
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
		oController.loadSingleImageThumbnailViewData(oController, oChildGpsPathThumbnailViewThumbnail, oTimeFrom, oTimeTo);
		
    },
    
    // UI ElogVideoGpsPathThumbnailView
    onInitVideoGpsPathThumbnailView: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitVideoGpsPathThumbnailView,
    		'args' : oEvent
    	});
    	
    	// Add listener
    	var oController = this;
    	
    	// XXX Perform separated initialization because of different media type.
    	// TODO May come up with an idea to call server one time on composite media types
    	// TODO We have to use video posterUrl as the image source. 
    	var oChildVideoGpsPathThumbnailViewVideo = oController.getChildVideoGpsPathThumbnailViewVideo();
    	var oChildVideoGpsPathThumbnailViewCoverFlow = oController.getChildVideoGpsPathThumbnailViewCoverFlow();
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	var oResultGetMediaList = oMedia.getMediaList({
    		params: {
	    		mediaType: 'video',
	        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
	        	timeTo: Math.round(oTimeTo.getTime()/1000),
	        	thumbnailWidth: (oChildVideoGpsPathThumbnailViewCoverFlow.getThumbnailWidth() == null) ? null : oChildVideoGpsPathThumbnailViewCoverFlow.getThumbnailWidth(),
	        },
    		onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
            	oChildVideoGpsPathThumbnailViewVideo.loadData(oResult);
    		
        		/**
        		 * Perform time range search and prepare image list loading
        		 */
        		var oStartUnixtime = null;
        		var oEndUnixtime = null;
        		
        		if (oChildVideoGpsPathThumbnailViewVideo.getMediaList() == null) return;
        		
        		oChildVideoGpsPathThumbnailViewVideo.getMediaList().forEach(function(oVideo){
        			if (oStartUnixtime == null || oStartUnixtime > oVideo.startUnixtime) {
        				oStartUnixtime = oVideo.startUnixtime;
        			}
        			if (oEndUnixtime == null || oEndUnixtime < oVideo.endUnixtime) {
        				oEndUnixtime = oVideo.endUnixtime;
        			}
        			
        			// oVideo.mediaUrl = oVideo.posterUrl;
        			oVideo.image = oVideo.posterUrl;
		        });
		        
		        oChildVideoGpsPathThumbnailViewCoverFlow.onProcessImageList(oResult);
        		
            	// Set time range
		        if (oStartUnixtime != null && oEndUnixtime != null) {
		        	var oApiBase = new Elog.api.Base();
	        		oApiBase.setCookie("elogStartTime", new Date(oStartUnixtime*1000));
	            	oApiBase.setCookie("elogEndTime", new Date(oEndUnixtime*1000));
	            	
	            	// This should be changed to fire ElogEvent to synchronize timeslidertoolbar
	            	// oController.onTimeRangeChange();
	            	oChildVideoGpsPathThumbnailViewVideo.fireElogEvent({
	    				eventName: 'timerangechange', 
	    				eventConfig: {
	    					unixTimestamp: oStartUnixtime,
	    					caller: oChildVideoGpsPathThumbnailViewVideo,
	    				}
	    			});
		        }
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
        
    	var oGpsPath = oController.getChildVideoGpsPathThumbnailViewGpsPath();
		
    	var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	// Initialize map view
    	
    	// var oMedia = Ext.create('Elog.api.media.SensorKeyValueManager');
		var oManager = this.getSensorManager();
		
		// Calculate the map boundary
		oGpsPath.getMapBoundary();
		
    	var oResultGetSensorDatabyTimeSpan = oManager.getSensorDatabyTimeSpan({
    		// TODO Below media type should be 'sensor' not 'android'
    		mediaType: 'android',
    		sensors: '%GPSLocationEvent',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000),
        	timeTo: Math.round(oTimeTo.getTime()/1000),
            samplingSecond: 10,
			maxCount: 1000,
        	onSuccess: function(oResult) { 
        		oController.attachResult(oResult.result);
        		
    			var result = oGpsPath.loadData(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
        
        // Initialize thumbnail view
        var oChildVideoGpsPathThumbnailViewThumbnail = oController.getChildVideoGpsPathThumbnailViewThumbnail();
		
        if (oChildVideoGpsPathThumbnailViewThumbnail != null) {
        //	this.onInitChildVideoGpsPathThumbnailViewThumbnail(oEvent, opts);
        	this.onInitChildVideoGpsPathSingleImageThumbnailViewThumbnail(oEvent, opts);
        }
        
    },
    
    /**
     * Image thumbnail initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildVideoGpsPathThumbnailViewThumbnail: function (oEvent, opts) {
    	// Set search call function
    	/*
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildImageThumbnailViewThumbnail,
    		'args' : oEvent
    	});
    	*/
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildVideoGpsPathThumbnailViewThumbnail = oController.getChildVideoGpsPathThumbnailViewThumbnail();
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	var oReturnResult = oMedia.getMediaList({
    		params: {
	    		mediaType: 'image',
	        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
	        	timeTo: Math.round(oTimeTo.getTime()/1000),
	        	// width: (oEvent.getThumbnailWidth() == null) ? null : oEvent.getThumbnailWidth()*2,
	        },
    		onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		oChildVideoGpsPathThumbnailViewThumbnail.onProcessImageList(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Image thumbnail initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildVideoGpsPathSingleImageThumbnailViewThumbnail: function (oEvent, opts) {
    	// Set search call function
    	/*
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildImageThumbnailViewThumbnail,
    		'args' : oEvent
    	});
    	*/
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildVideoGpsPathThumbnailViewThumbnail = oController.getChildVideoGpsPathThumbnailViewThumbnail();
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
		oController.loadSingleImageThumbnailViewData(oController, oChildVideoGpsPathThumbnailViewThumbnail, oTimeFrom, oTimeTo);
		
    },
    
    loadSingleImageThumbnailViewData: function(oController, oChildSingleImageThumbnail, oTimeFrom, oTimeTo) {
    	var oInitTimer = setTimeout(function() { 
			if (oChildSingleImageThumbnail.element.getWidth() === null ||
	    		oChildSingleImageThumbnail.element.getWidth() < 10) {
	    		oInitTimer = setTimeout(arguments.callee, 500);
	    	}
	    	else {
	    		var oMedia = Ext.create('Elog.api.media.Base');
				var oRunResult = oMedia.runCommand({
		    		command: 'Media.base.GetSingleImageThumbnail',
		    		params: {
			    		mediaType: 'image',
			        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
			        	timeTo: Math.round(oTimeTo.getTime()/1000),
			        	imageWidth: oChildSingleImageThumbnail.element.getWidth(),
			        	tileCount: oChildSingleImageThumbnail.getThumbnailRowCount()
		        	},
		    		onSuccess: function(oResult) {
		        		oController.attachResult(oResult.result);
		        		oChildSingleImageThumbnail.onProcessSingleImageThumbnailView(oResult);
		        	},
		        	onFail: function(oResult) {
		        		oController.attachResult(oResult.result);
		        		oController.updateInstruction();
		        	}
		        });
				clearTimeout(oInitTimer);
	    	}
		}, 500); 
    },
});