/**
 * Image slideshow.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.canvas.image.Slideshow', {
 *     	fullscreen:true
 *     });
 *     
 */
Ext.define('Elog.view.ui.panel.div.canvas.image.Slideshow', {
	extend: 'Elog.view.ui.panel.div.canvas.image.Base',
    xtype: 'elogImageSlideshow',
    config : {
		name: 'idImageSlideshow',
		
		/**
    	 * The set of images to display on the canvas
    	 */
    	images: [],
    	
		/**
		 * Set the current slide show status as STOP. Available configurations are
		 * {'slideshow_play', 'slideshow_pause', 'slideshow_stop'}
		 */
		isPlay : 'slideshow_stop',
        
		currentZoomImageId : -1,
		lastZoomImageId: -1,
		/**
		 * Current slide show image ID
		 */
		currentSlideImageId : -1,
		/**
		 * Last slide show image ID
		 */
        lastSlideImageId : -1,
        thumbnailWidth: "256", // in pixel
    	
    	/**
    	 * Slide change delay
    	 */
    	slideTimeDelay : 300, // 300 milliseconds
    	/**
    	 * Current slide image object
    	 */
        slideImage: null,
        /**
         * Currently selected image id
         */
        currentImageId : -1,
        /**
         * Slide show time interval
         */
        slideInterval : null,
        timerObject: null,
        /**
         * Status to display image metadata
         */
        showMetadata: true,
        /**
         * Loaded image count
         */
        loadedImageCount: 0,
        /**
         * Status to display the image as soon as it is loaded from the server
         */
        showPreview: true,
        /**
         * Status to display the loading count 
         */
        showLoadingCount: true,
        
        listeners: {
        	tap: function (e) {
        		this.onToggleSlideShow();
        	}
        }
    },
	
    init: function() {
        //init Hypertree
    	var oSlideshow = this;
	    var oImageViewer = this;
	    
	    if (this.getCanvas() == null) {
			this.setCanvas(this.getDivObject());
		    this.setCanvasContext(this.getCanvas().getContext("2d")); 
		}
	    
	    this.getCanvas().width = this.element.getWidth();
	    this.getCanvas().height = this.element.getHeight();
	    this.getCanvas().caller = this;
	    
	    this.getCanvas().onclick = function(e) {
	    	oImageViewer.onToggleSlideShow();
	    };
	    this.getCanvas().touchstart = function(e) {
	    	oImageViewer.onToggleSlideShow();
	    };
	    
	    this.attachInputListener();
    },

    /**
     * Attach input event listener 
     */
    attachInputListener : function() { 
        // Attach keyboard listener using JQuery
        var oContainer = this;
        $(document).keyup(function(evt) {
            switch(evt.which) {
            case 13: // return
            	oContainer.onToggleFullScreen();
                break;
            case 32: // space
            	oContainer.onToggleSlideShow();
                break;
            case 27: // esc
            	oContainer.onStopSlideShow();
                break;
            case 39: // rightkey
                break;
            case 37: // left
                break;
            case 38: // up
                break;
            case 40: // down
                break;
            }
        });
        
        // Attach mousewheel listener
        $(document).bind('mousewheel', function(event, delta) {
            // var oContainer = Ext.getCmp(this.getDivObject());
            
            if (typeof oContainer.scroller != 'undefined') {
                // var oScrollDirection = delta > 0 ? 'Up' : 'Down';
                var oScrollDirection = delta > 0 ? 1 : -1;
                
                if ((oScrollDirection > 0) && (oContainer.scroller.offset.y < 0)) {
                    oContainer.scroller.scrollBy(
                        {x:0, y: parseInt(delta*20)},
                        false
                    );
                }
                
                if ((oScrollDirection < 0) && (oContainer.scroller.offset.y > 
                    (oContainer.getCanvas().height - oContainer.height) * -1)) {
                    oContainer.scroller.scrollBy(
                        {x:0, y: parseInt(delta*20)},
                        false
                    );
                }
            }
            
            return false;
        });
    },

    /**
     * Detach input event listener 
     */
    detachInputListener : function() { 
        $(document).unbind('keyup');
        $(document).unbind('mousewheel');
    },

    /**
     * On stop Slideshow
     */
    onStopSlideShow : function() { 
        this.setLastSlideImageId(-1);
        this.setCurrentSlideImageId(-1);
        this.setLastZoomImageId(-1);
        
        this.setIsPlay('slideshow_stop');
        
        // Kill all timers
        if (this.getTimerObject()) {
        	clearTimeout(this.getTimerObject());
        }
    },

    /**
     * On toggle Slide show
     */
    onToggleSlideShow : function() {
        if (this.getIsPlay() == 'slideshow_play') {
        	this.playSlideShow(false);
        }
        else {
            this.playSlideShow(true);
        }
    },

    showSlideImage: function (oCurrentSlideImageId) {
    	// Check range
    	if (oCurrentSlideImageId < 0 || oCurrentSlideImageId >= this.getImages().length) {
    		this.logError('Slide image id is out of range: '+oCurrentSlideImageId);
    		return false;
    	}
    	
    	this.setCurrentSlideImageId(oCurrentSlideImageId);
    	this.setLastSlideImageId(oCurrentSlideImageId);
    	
        var oCanvasImage = this.getImages()[oCurrentSlideImageId];
        if (!oCanvasImage) return;
        
        // Load full size image
        if (oCanvasImage.src.match(/width%22:[0-9]+,/gi)) {
			// Update URL to load the full size image
			oCanvasImage.src =  oCanvasImage.src.replace(/width%22:[0-9]+,/gi, "width%22:null,");
		}
		else if (oCanvasImage.src.match(/width%22:%22[0-9]+%22,/gi)) {
			oCanvasImage.src =  oCanvasImage.src.replace(/width%22:%22[0-9]+%22,/gi, "width%22:null,");
		}
        
        // Then load the original quality image
        this.setSlideImage(oCanvasImage);
        
        // Draw image
    	var oRegion = this.calculateDisplayRegion({
    		image: oCanvasImage,
    		canvas: this.getCanvas(),
    		keepRatio: this.getKeepRatio(),
    		offset: this.getDisplayOffset()
    	});
	    
        // Draw image
    	this.getCanvasContext().drawImage(
			oCanvasImage, oRegion.x, oRegion.y, oRegion.width, oRegion.height
        );
        
    	// Display metadata
        if (this.getShowMetadata()) {
            this.displayMetadata({
    			canvas: this.getCanvas(),
    			data: '['+(oCurrentSlideImageId+1)+' / '+this.getImages().length+'] '+oCanvasImage.timestamp,
    			offset: this.getDisplayOffset(),
    			region: oRegion
    		});
        }
        
        /*
        this.fireElogEvent({
			eventName: 'timechange', 
			eventConfig: {
				unixTimestamp: oCanvasImage.unixtimestamp,
				caller: this,
			}
		});
		*/
    },
    
    /**
     * Load Slideshow images. This is the recursive call that loads next image automatically 
     * @param {Object} this
     * @param {Number} oCurrentSlideImageId
     * @returns
     */
    loadSlideImage : function(oCurrentSlideImageId) {
    	// Check range
    	if (oCurrentSlideImageId < 0 || oCurrentSlideImageId >= this.getImages().length) {
    		this.logError('Slide image id is out of range: '+oCurrentSlideImageId);
    		return false;
    	}
    	
    	if (this.showSlideImage(oCurrentSlideImageId) == false) {
    		return false;
    	}
        
        ++oCurrentSlideImageId;
        if (oCurrentSlideImageId >= this.getImages().length) {
            oCurrentSlideImageId = 0;
        }
        
        this.setCurrentSlideImageId(oCurrentSlideImageId);
        
        // If loaded, set timer
        var oImageViewer = this;
        
        if (this.getIsPlay() == 'slideshow_play') {
        	this.setTimerObject(
        		setTimeout(function() {
    	        	oImageViewer.loadSlideImage(oImageViewer.getCurrentSlideImageId());
    	        }, this.getSlideTimeDelay())
            );
        }
        
        this.fireElogEvent({
			eventName: 'timechange', 
			eventConfig: {
				unixTimestamp: this.getImages()[this.getCurrentSlideImageId()].unixtimestamp,
				caller: this,
			}
		});
    },

    /**
     * Play Slideshow
     */
    playSlideShow : function(oOption) {
        if (oOption == false) {
            // This is pause
            this.setLastSlideImageId(this.getCurrentSlideImageId());
            // this.m_iCurrentSlideImageId = -1;
            
            if (this.getTimerObject()) {
            	clearTimeout(this.getTimerObject());
            	this.setTimerObject(null);
            }
            
            this.setIsPlay('slideshow_pause');
        }
        else {
            var oCurrentSlideImageId;
            
            if (this.getIsPlay() == 'slideshow_pause') {
                oCurrentSlideImageId = this.getLastSlideImageId();
            }
            else if (this.getIsPlay() == 'slideshow_stop') {
                if (this.getCurrentZoomImageId() < 0)
                    this.setCurrentSlideImageId(0);

                oCurrentSlideImageId = this.getCurrentZoomImageId();
                this.setLastZoomImageId(this.getCurrentZoomImageId());
            }
            
            // Check the range of oCurrentSlideImageId
            if (oCurrentSlideImageId >= this.getImages().length ||
                oCurrentSlideImageId < 0) {
                oCurrentSlideImageId = 0;
            }
            
            this.setIsPlay('slideshow_play');
            this.setCurrentSlideImageId(oCurrentSlideImageId);
            this.loadSlideImage(oCurrentSlideImageId);
        }
    },
    
    onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
        if (parseInt(this.getCurrentUnixTimestamp()) != oUnixTimestamp) {
	    	this.setCurrentUnixTimestamp(oUnixTimestamp);
	        
	        var oViewer = this;
	    	var oStartItem = null;
	    	
	    	//    oImage.timestamp = data[i].lastRecordingTime;
            //    oImage.unixtimestamp = data[i].utcTimestamp;
            //    	oImage.timestamp = data[i].lastRecordingTime;
			this.getImages().forEach(function(oData, i) {
	    		if (Number(oData.unixtimestamp) >= oUnixTimestamp && oStartItem == null) {
	    			oStartItem = i;
	    			oViewer.showSlideImage(i);
				}
			});    
			
			if (oStartItem == null) {
				oViewer.showSlideImage(oViewer.getImages().length-1);	
			}
        }
    },

    onToggleFullScreen : function() {

    },
    
    /**
     * laodData. Created for the compatibility
     * @param {} data
     */
    loadData: function(data) {
    	this.onProcessImageList(data);
    },

    /**
     * Process the query result to retrieve the image list
     * 
     * @param {Object} data
     */
    onProcessImageList : function(data) {
        if (data && data.root && !!data.root.length) {
            data = data.root;
            
            // Create image objects
            var oImage;
            
            // Purge existing images
            if (this.getImages().length > 0) {
            	while (this.getImages().length) { this.getImages().pop(); }
            }
            
            for (var i = 0; i < data.length; ++i) {
                // Check existing image object
                if (this.getImages().length > i) {
                    oImage = this.getImages()[i];
                }
                else {
                    oImage = new Image();
                    this.getImages().push(oImage);
                }
                
                // Set image source
                oImage.src = data[i].mediaUrl;
            //    oImage.timestamp = data[i].lastRecordingTime;
            //    oImage.unixtimestamp = data[i].utcTimestamp;
                
                if (typeof data[i].lastRecordingTime != "undefined") {
                	oImage.timestamp = data[i].lastRecordingTime;
				}
				else {
					oImage.timestamp = data[i].eml_event_timestamp;
				}
				
                if (typeof data[i].utcTimestamp != "undefined") {
                	oImage.unixtimestamp = data[i].utcTimestamp;
				}
				else {
					oImage.unixtimestamp = data[i].unixtimestamp;
				}
            }
                            
            // Draw image objects
            var oImageViewer = this;
            for (var i = 0; i < this.getImages().length; ++i) {
                oImage = this.getImages()[i];
                
                oImage.onload = function() {
                	oImageViewer.setLoadedImageCount(
            			oImageViewer.getLoadedImageCount()+1
        			);
                	
                	var oRegion = oImageViewer.calculateDisplayRegion({
        	    		image: this,
        	    		canvas: oImageViewer.getCanvas(),
        	    		keepRatio: oImageViewer.getKeepRatio(),
        	    		offset: oImageViewer.getDisplayOffset()
        	    	});
        		    
        	        // Draw image
                	if (oImageViewer.getShowPreview()) {
                		oImageViewer.getCanvasContext().drawImage(
            				this, oRegion.x, oRegion.y, oRegion.width, oRegion.height
            	        );
                	}
        	        
        	    	// Display loading status
                	if (oImageViewer.getShowLoadingCount()) {
                		if (oImageViewer.getLoadedImageCount() >= oImageViewer.getImages().length) {
                			oImageViewer.displayMetadata({
                    			canvas: oImageViewer.getCanvas(),
                    			data: 'Loading completed.',
                    			offset: oImageViewer.getDisplayOffset(),
                    			region: oRegion
                    		});
                		}
                		else {
                			oImageViewer.displayMetadata({
                    			canvas: oImageViewer.getCanvas(),
                    			data: 'Loading... ['+(oImageViewer.getLoadedImageCount()+1)+' / '+oImageViewer.getImages().length+'] '+this.timestamp,
                    			offset: oImageViewer.getDisplayOffset(),
                    			region: oRegion
                    		});
                		}
            	    	
                	}
                };
            }
        }
    }
});
