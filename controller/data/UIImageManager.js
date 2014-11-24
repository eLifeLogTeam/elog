/**
 * Elog controller: UIImageManager
 * 
 */
Ext.define('Elog.controller.data.UIImageManager', {
	extend: 'Elog.controller.data.UIManager',
    requires: [
       'Elog.controller.data.UIManager',
       'Ext.util.Droppable',
       'Elog.view.panel.media.CoverFlowView',
       'Elog.view.panel.media.SlideshowView',
       'Elog.view.panel.media.ThumbnailView',
       'Elog.view.panel.media.FaceThumbnailView',
       'Elog.view.panel.media.ThumbnailSlideshowView',
    ],
	config: {
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        // 'Elog.view.panel.media.sensor.CEPEditor',
		],
		/**
		 * When designing your own UIImageManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			// UI Image Slideshow View
            imageSlideshowView: '#idElogSlideshowView',
            childImageSlideshowViewSlideshow: '#idChildImageSlideshowViewSlideshow',
            
            // UI Image CoverFlow View
            imageCoverFlowView: '#idElogCoverFlowView',
            childCoverFlowViewCoverFlow: '#idChildCoverFlowViewCoverFlow',
            
            // UI Image Thumbnail View
            imageThumbnailView: '#idElogImageThumbnailView',
            childImageThumbnailViewThumbnail: '#idChildImageThumbnailViewThumbnail',
            
            // UI Face Thumbnail View
            faceThumbnailView: '#idElogFaceThumbnailView',
            childFaceThumbnailViewThumbnail: '#idChildFaceThumbnailViewThumbnail',
            
            // UI Image Thumbnail Slideshow
            imageThumbnailSlideshowView: '#idElogImageThumbnailSlideshowView',
            childImageThumbnailSlideshowThumbnail: '#idChildThumbnailSlideshowThumbnail',
            childImageThumbnailSlideshowSlideshow: '#idChildThumbnailSlideshowSlideshow',
        },

		control: {
           
            // UI Image Slideshow View
            imageSlideshowView: {
            },
            childImageSlideshowViewSlideshow: {
            	initdiv: 'onInitChildImageSlideshowViewSlideshow',
            	timechange: 'onTimeChange',
            },
            
            // UI Image CoverFlow View
            imageCoverFlowView: {
            },
            childCoverFlowViewCoverFlow: {
            	initialize: 'onInitChildCoverFlowViewCoverFlow',
            	timechange: 'onTimeChange',
            },
            
            // UI Image Thumbnail View
            imageThumbnailView: {
            },
            childImageThumbnailViewThumbnail: {
            	initdiv: 'onInitChildImageThumbnailViewThumbnail',
            	timechange: 'onTimeChange'
            },
            
            // UI Face Thumbnail View
            faceThumbnailView: {
            },
            childFaceThumbnailViewThumbnail: {
            	initdiv: 'onInitChildFaceThumbnailViewThumbnail',
            	timechange: 'onTimeChange'
            },
            
            // UI Image Thumbnail Slideshow View
            imageThumbnailSlideshowView: {
            },
            childImageThumbnailSlideshowThumbnail: {
            	initdiv: 'onInitChildImageThumbnailSlideshowThumbnail',
            	timechange: 'onTimeChange'
            },
            childImageThumbnailSlideshowSlideshow: {
            	initdiv: 'onInitChildImageThumbnailSlideshowSlideshow',
            	timechange: 'onTimeChange',
            },
		},
        routes: {
            'demo/:id': 'showViewById',
            'menu/:id': 'showMenuById',
            '': 'showMenuById'
        },

        /**
         * @cfg {Ext.data.Model} currentDemo The Demo that is currently loaded. This is set whenever showViewById
         * is called and used by functions like onSourceTap to fetch the source code for the current demo.
         */
        currentDemo: undefined,
        
        /**
         * 
         * @cfg The current demo should set this function to be called when the search time range is changed 
         * to perform the data call again. 
         */
        currentSearchFunction: undefined,
        
        currentSetupFunction: undefined,
        
        before: {
        	showViewById: 'onAuthenticate'
        },
		
		sensorCEPManager: null,
		selectedSensors: null,
	},

	getSensorManager: function() {
		if (this.getSensorCEPManager() == null) {
			this.setSensorCEPManager(new Ext.create('Elog.api.media.SensorCEPManager'));
		}
		
		return this.getSensorCEPManager();
	},
	
    
    onTimeChange: function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
    	var oController = this;
    	
    	oController.putTimeChangeListener(oController.getChildTimeSliderToolbar());
    	
    	// Add listener
    	// UI Image Slideshow View
    	oController.putTimeChangeListener(oController.getChildImageSlideshowViewSlideshow());
    	
    	// UI Image CoverFlow View
    	oController.putTimeChangeListener(oController.getChildCoverFlowViewCoverFlow());
    	
    	// UI Image Thumbnail View
    	oController.putTimeChangeListener(oController.getChildImageThumbnailViewThumbnail());
    	
    	// UI Image Thumbnail Slideshow View
    	oController.putTimeChangeListener(oController.getChildImageThumbnailSlideshowThumbnail());
    	oController.putTimeChangeListener(oController.getChildImageThumbnailSlideshowSlideshow());
    	
    	// Distribute event to all UIs under control.
    	oController.getTimeChangeListeners().forEach(function(oTimeChangeListener) {
    		if (typeof oTimeChangeListener.onTimeChange != "undefined" &&
    			oTimeChangeListener.getItemId() != oEventConfig.caller.getItemId()) {
    			oTimeChangeListener.onTimeChange(oEventConfig);
    		}
    	});
    },
    
    /**
     * Image Slideshow initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildImageSlideshowViewSlideshow: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildImageSlideshowViewSlideshow,
    		'args' : oEvent
    	});
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildImageSlideshowViewSlideshow = oController.getChildImageSlideshowViewSlideshow();
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oMedia.getMediaList({
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	// width: (oEvent.getThumbnailWidth() == null) ? null : oEvent.getThumbnailWidth()*2,
        	width: oChildImageSlideshowViewSlideshow.getThumbnailWidth(),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		oChildImageSlideshowViewSlideshow.onProcessImageList(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Image CoverFlow initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildCoverFlowViewCoverFlow: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildCoverFlowViewCoverFlow,
    		'args' : oEvent
    	});
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
    	
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
		var oChildCoverFlowViewCoverFlow = oController.getChildCoverFlowViewCoverFlow();
		var oThumbnailWidth = oChildCoverFlowViewCoverFlow.getThumbnailWidth()
		
		/*
		if (typeof oChildCoverFlowViewCoverFlow.itemBox != "undefined") {
			oThumbnailWidth = oChildCoverFlowViewCoverFlow.itemBox.width;
		}
		else {
			oThumbnailWidth = oChildCoverFlowViewCoverFlow.getThumbnailWidth();
		}
		*/
		
    	return oMedia.getMediaList({
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	width: (oThumbnailWidth == null) ? null : oThumbnailWidth,
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
        		// This does not exist. So we have to implement this.
        		oChildCoverFlowViewCoverFlow.onProcessImageList(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Image Slideshow initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildImageThumbnailViewThumbnail: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildImageThumbnailViewThumbnail,
    		'args' : oEvent
    	});
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildImageThumbnailViewThumbnail = oController.getChildImageThumbnailViewThumbnail();
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oMedia.getMediaList({
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	// width: (oEvent.getThumbnailWidth() == null) ? null : oEvent.getThumbnailWidth()*2,
        	width: oChildImageThumbnailViewThumbnail.getThumbnailWidth(),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		oChildImageThumbnailViewThumbnail.onProcessImageList(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    
    /**
     * Face Slideshow initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildFaceThumbnailViewThumbnail: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildFaceThumbnailViewThumbnail,
    		'args' : oEvent
    	});
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildFaceThumbnailViewThumbnail = oController.getChildFaceThumbnailViewThumbnail();
		oChildFaceThumbnailViewThumbnail.clearCanvas();

		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
		// var oMedia = Ext.create('Elog.api.media.SensorKeyValueManager');
		var oManager = this.getSensorManager();
		
    	return oManager.getSensorDatabyTimeSpan({
    		// TODO Below media type should be 'sensor' not 'android'
    		mediaType: 'android',
    		sensors: 'Opencv/DetectFace/Image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000),
        	timeTo: Math.round(oTimeTo.getTime()/1000),
            width: oChildFaceThumbnailViewThumbnail.getThumbnailWidth(),
        	onSuccess: function(oResult) { 
        		oController.attachResult(oResult.result);
    			var result = oChildFaceThumbnailViewThumbnail.onProcessSensorData(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Image Slideshow initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildImageThumbnailSlideshowThumbnail: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildImageThumbnailSlideshowThumbnail,
    		'args' : oEvent
    	});
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildImageThumbnailSlideshowThumbnail = oController.getChildImageThumbnailSlideshowThumbnail();
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oMedia.getMediaList({
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	// width: (oEvent.getThumbnailWidth() == null) ? null : oEvent.getThumbnailWidth()*2,
        	width: oChildImageThumbnailSlideshowThumbnail.getThumbnailWidth(),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		oChildImageThumbnailSlideshowThumbnail.onProcessImageList(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Image Slideshow initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChildImageThumbnailSlideshowSlideshow: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChildImageThumbnailSlideshowSlideshow,
    		'args' : oEvent
    	});
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oChildImageThumbnailSlideshowSlideshow = oController.getChildImageThumbnailSlideshowSlideshow();
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oMedia.getMediaList({
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	// width: (oEvent.getThumbnailWidth() == null) ? null : oEvent.getThumbnailWidth()*2,
        	width: oChildImageThumbnailSlideshowSlideshow.getThumbnailWidth(),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		oChildImageThumbnailSlideshowSlideshow.onProcessImageList(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Image thumbnail Slideshow initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * 
     * @return {Object|Boolean} 
     */
    onInitImageThumbnailSlideshow: function(oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitImageThumbnailSlideshow,
    		'args' : oEvent
    	});
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oImageThumbnailSlideshow = oController.getImageThumbnailSlideshow();
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oMedia.getMediaList({
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	width: oImageThumbnailSlideshow.getThumbnailWidth(),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		oImageThumbnailSlideshow.getItems().items.forEach(function(oItem) {
        			oItem.onProcessImageList(oResult);
        		});
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
     * 
     * @return {Object|Boolean} 
     */
    onImageThumbnailSelect: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onImageThumbnailSelect,
    		'args' : oEvent
    	});
    	
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		var oSlideshow = oController.getImageThumbnailSlideshow().getItems().getByKey('idChildSlideshow');
		
		oSlideshow.showSlideImage(oEvent);
    },
    
});