/**
 * Image thumbnail viewer.
 * 
 * @author pilhokim
 * 
 * @deprecated
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.canvas.image.ImageThumbnailSlideshow', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.canvas.image.ImageThumbnailSlideshow', {
	extend: 'Elog.view.ui.panel.div.canvas.image.Base',
    xtype: 'elogImageThumbnailSlideshow',
    config : {
		name: 'idImageThumbnailSlideshow',
    	
		/**
		 * Set the current slide show status as STOP. Available configurations are
		 * {'slideshow_play', 'slideshow_pause', 'slideshow_stop'}
		 */
		isPlay : 'slideshow_stop',
        
		scrollable : {
    		direction : 'vertical'
    	},
		// scroll: 'vertical',
		
		/**
		 * Current slide show image ID
		 */
		currentSlideImageId : -1,
		/**
		 * Last slide show image ID
		 */
        lastSlideImageId : -1,
        /**
         * Last zoom image ID
         */
        lastZoomImageId : -1,
        /**
         * The count of image to display in one row
         */
        thumbnailRowCount : 7,    	
        /**
         * The size of zoomed (slideshow) image width
         */
        zoomThumbnailWidth : 640,
        /**
         * The size of zoomed (slideshow) image height
         */
    	zoomThumbnailHeight : 480,
    	
    	/**
    	 * Default query start time
    	 */
    	startTime: new Date(2010,10-1,14,0,0,0),
    	
    	/**
    	 * Default query end time
    	 */
    	endTime: new Date(2010,10-1,15,23,59,59),
    	
    	/**
    	 * The set of images to display on the canvas
    	 */
    	canvasImages: null,
    	
    	/**
    	 * Slide change delay
    	 */
    	slideTimeDelay : 300, // 300 milliseconds
    	/**
    	 * Current slide image object
    	 */
        slideImage: null,
    	/**
    	 * Current zoom image object
    	 */
        zoomImage: null,
        /**
         * Image object to replace
         */
    	replaceZoomImage: null,
    	/**
    	 * Whether to show image meta information over the image
    	 */
    	showMetaInformation: false,
    	/**
    	 * Context of the canvas image object
    	 */
    	canvasImageContext: null,
    	/**
    	 * Default image preview width
    	 */
    	defaultImageWidth : 640,
        /**
         * Default image preview height
         */
    	defaultImageHeight : 480,
    	/**
    	 * List of image objects
    	 */
    	images : [],
        /**
         * Collection of x coordinates of images
         */
    	imagesx : [],
    	/**
    	 * Collection of y coordinates of images
    	 */
        imagesy : [],
        /**
         * Image canvas object
         */
        imageCanvas : null,
        /**
         * Image canvas context
         */
        imageContext : null,
        /**
         * Currently selected image id
         */
        currentImageId : -1,
        /**
         * Image geo coder
         */
        imageGeoCoder : null,
        /**
         * Image map center marker
         */
        imageMapCenterMarker : null,
        /**
         * Image information meta data
         */
        imageInformation : null,
        /**
         * Selected image ID
         */
        selectedImageId : false,
        /**
         * Slide show time interval
         */
        slideInterval : null,
        /**
         * Canvas object to display image information
         */
        imageInformationCanvas : null,
        /**
         * Image information context
         */
        imageInformationContext : null,
        /**
         * Informaiton image object
         */
        informationImage : null,
        /**
         * Image inofmraiton temperature object
         */
        imageInformationTemperature : null,
        /**
         * Image information description object
         */
        imageInformationDescription : null,
        // searchImageStore: null,
        /**
         * Thumbnail width
         */
        thumbnailWidth: null,
        /**
         * Thumbnail height
         */
        thumbnailHeight: null
    },
	
    init: function() {
        //init Hypertree
    	var oImageFlowViewer = this;
    	
    	if (this.getThumbnailWidth() == null) {
    		this.setThumbnailWidth(this.getDefaultImageWidth()/10);
    	}
    	
    	if (this.getThumbnailHeight() == null) {
    		this.setThumbnailHeight(
				parseInt(this.getThumbnailWidth() * this.getDefaultImageHeight() / this.getDefaultImageWidth())
			);
    	}
    	/*
	    this.setSearchImageStore(new Ext.data.Store({
	        model: 'elogImageList',
	        proxy: {
	            type: 'localstorage',
	            id: 'elog_image_viewer_config'
	        }
	    }));
    	*/
    	
        // this.loadDatabyTimeDuration(this.getStartTime(), this.getEndTime());
        
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
        $(document).stopTime('idTimerSlide');
        $(document).stopTime('idMoreTimerSlide1');
        $(document).stopTime('idMoreTimerSlide2');
        
        // Remove
        this.redrawBackground();
        this.setCheckMouseMovement();
    },

    /**
     * On toggle Slide show
     */
    onToggleSlideShow : function() {
        if (this.getIsPlay() == 'slideshow_play') {
        	this.playSlideShow(false);
        }
        else {
            this.setCheckMouseMovement(false);
            this.playSlideShow(true);
        }
    },

    onToggleFullScreen : function() {

    },

    /**
     * Load Slideshow images
     * @param {Object} this
     * @param {Number} oCurrentSlideImageId
     * @returns
     */
    loadSlideImage : function(oCurrentSlideImageId) {
        if (oCurrentSlideImageId < 0) return;
        
        var oCanvasImage = this.getCanvasImages()[oCurrentSlideImageId];
        if (!oCanvasImage) return;
        
        // Then load the original quality image
        if (oCanvasImage.hasOriginal == true) {
            this.setSlideImage(oCanvasImage);
        }
        else {
            this.setSlideImage(new Image());
            
            this.getSlideImage().timestamp = oCanvasImage.timestamp;
            this.getSlideImage().imageId = oCurrentSlideImageId;
        }
        
        this.getSlideImage().contextx = oCanvasImage.contextx;
        this.getSlideImage().contexty = oCanvasImage.contexty;
        this.getSlideImage().zoomx = this.getZoomImage().zoomx;
        this.getSlideImage().zoomy = this.getZoomImage().zoomy;
        
        // XXX This should be improved later. Commented on 22 Sep 2014. This is not used in UI demo
        // this.getSlideImage().this = this;
        
        if (oCanvasImage.hasOriginal) {
            // Draw image
            this.oCanvasImageContext.drawImage(
                this.getSlideImage(), 
                parseInt(this.getSlideImage().zoomx), 
                parseInt(this.getSlideImage().zoomy),
                this.getZoomThumbnailWidth(),
                this.getZoomThumbnailHeight()
            );
            
            if (this.getShowMetaInformation() == true) {
                this.displayMetadata(this.getSlideImage());
            }
            
            var oCurrentSlideImageId = this.getCurrentSlideImageId();
            
            ++oCurrentSlideImageId;
            if (oCurrentSlideImageId >= this.getCanvasImages().length) {
                oCurrentSlideImageId = 0;
            }
            
            this.setCurrentSlideImageId(oCurrentSlideImageId);
            
            // If loaded, set timer
            oControl = this;
            $(document).oneTime(this.getSlideTimeDelay(), 'idTimerSlide', function() {
            	oControl.loadSlideImage(oCurrentSlideImageId);
            });
        }
        else {
            // Measure time
            this.setStartTime(new Date().getTime());
            
            // Set image source
            this.getSlideImage().src = oServerSetting['server_index_key']+
                    '&elog_command=GetImage&utctimestamp='+
                    this.getSlideImage().timestamp;
            
            // Draw image objects
            var oControl = this;
            this.getSlideImage().onload = function() {
                // Measure the duration
            	oControl.setEndTime(new Date().getTime());
                var oDelay = (oControl.getEndTime() - oControl.getStartTime());
                
                // Check whether the Slide show stopped
                if (oControl.getCurrentSlideImageId() >= 0) {
                    if (oDelay < oControl.getSlideTimeDelay()) {
                        var oMoreDelay = oControl.getSlideTimeDelay() - oDelay;
                        $(document).oneTime(oMoreDelay, 'idMoreTimerSlide1', function() {
                            // Draw image
                            oControl.getCanvasImageContext().drawImage(
                                oControl.getSlideImage(), 
                                parseInt(oControl.getZoomImage().zoomx), 
                                parseInt(oControl.getZoomImage().zoomy),
                                oControl.getZoomThumbnailWidth(),
                                oControl.getZoomThumbnailHeight()
                            );
                        });
                    }
                    else {
                        // Draw image
                        oControl.oCanvasImageContext.drawImage(
                            oControl.getSlideImage(), 
                            parseInt(oControl.getZoomImage().zoomx), 
                            parseInt(oControl.getZoomImage().zoomy),
                            oControl.getZoomThumbnailWidth(),
                            oControl.getZoomThumbnailHeight()
                        );
                    }
                    
                    if (oControl.getShowMetaInformation() == true) {
                        oControl.displayMetadata(oControl.getSlideImage());
                    }
                    
                    // Replace image
                    if (oControl.getReplaceZoomImage()) {
                        oControl.getSlideImage().hasOriginal = true;
                        oControl.getCanvasImages().splice(
                            oControl.getSlideImage().imageId,
                            1,
                            oControl.getSlideImage()
                        );
                    }
                }
                else {
                    // Discard image
                    delete oControl.getSlideImage();
                    oControl.setSlideImage(null);
                    
                    return;
                }
                
                ++oCurrentSlideImageId;
                if (oCurrentSlideImageId >= oControl.getCanvasImages().length) {
                    oCurrentSlideImageId = 0;
                }
                
                
                if (oDelay < oControl.getSlideTimeDelay()) {
                    var oMoreDelay = oControl.getSlideTimeDelay() - oDelay;
                    $(document).oneTime(oMoreDelay, 'idMoreTimerSlide2', function() {
                        oControl.loadSlideImage(oCurrentSlideImageId);
                    });
                }
                else {
                    oControl.loadSlideImage(oCurrentSlideImageId);
                }
            };
        }
    },

    /**
     * Play Slideshow
     */
    playSlideShow : function(oOption) {
        if (oOption == false) {
            // This is pause
            this.setLastSlideImageId(this.getCurrentSlideImageId());
            // this.m_iCurrentSlideImageId = -1;
            
            $(document).stopTime('idTimerSlide');
            $(document).stopTime('idMoreTimerSlide1');
            $(document).stopTime('idMoreTimerSlide2');
            
            this.setIsPlay('slideshow_pause');
        }
        else {
            var oCurrentSlideImageId;
            
            if (this.getIsPlay() == 'slideshow_pause') {
                oCurrentSlideImageId = this.getLastSlideImageId();
            }
            else if (this.oIsPlay == 'slideshow_stop') {
                if (this.getCurrentZoomImageId() < 0)
                    this.setCurrentSlideImageId(0);

                oCurrentSlideImageId = this.getCurrentZoomImageId();
                this.setLastZoomImageId(this.getCurrentZoomImageId());
            }
            
            // Check the range of oCurrentSlideImageId
            if (oCurrentSlideImageId >= this.getCanvasImages().length ||
                oCurrentSlideImageId < 0) {
                oCurrentSlideImageId = 0;
            }
            
            this.setIsPlay('Slideshow_play');
            this.setCurrentSlideImageId(oCurrentSlideImageId);
            this.loadSlideImage(oCurrentSlideImageId);
        }
    },

    /**
     * Redraw image list
     */
    onEventViewerRefresh : function() {
        ReadTimeRange();
        
        if (this.getImageGeoCoder()) delete this.getImageGeoCoder();
        
        this.setImageGeoCoder(new google.maps.Geocoder());

        // Read search configuration
        var oTimeConfig;
            
        if (oSearchTimeStore.getCount() > 0) {
            oTimeConfig = oSearchTimeStore.getRange();
        }
        else oTimeConfig = oSearchTimeConfig;
         
        $.ajax({
            url: oServerSetting['server_index'],
            dataType: 'jsonp',
            data: {
                user_key: $('idUserKey').val(),
                elog_command: 'GetImageList',
                serverurl: oServerSetting['server_index_key']+'&elog_command=GetImage&utctimestamp=',
                timefrom: (Ext.isArray(oTimeConfig)) ? 
                    Math.round(oTimeConfig[oTimeConfig.length-1].data.dateFrom.getTime()/1000) : '',
                timeto: (Ext.isArray(oTimeConfig)) ? 
                    Math.round(oTimeConfig[oTimeConfig.length-1].data.dateTo.getTime()/1000) : ''
            },
            success: function(data) {
                m_ImageViewer.onProcessImageList(data);
            }
        });
    },
    
    /**
     * Retrieve image ID from the touch/mouse location
     * 
     * @param {Number} iOffsetX
     * @param {Number} iOffsetY
	 * @return {Number|Boolean} Returns the image ID or false when not found.
     */
    getImageCanvasIdbyOffset : function(iOffsetX, iOffsetY) {
        var oImage;
        var iImageX;
        var iImageY;
        var oImage = null;
        
        if (this.getImages() == null) return false;
        
        for (var i = 0; i < this.getImages().length; ++i) {
            oImage = this.getImages()[i];
            
            iImageX = parseInt(oImage.contextx);
            iImageY = parseInt(oImage.contexty);
            
            if (iOffsetX >= iImageX && iOffsetX <= iImageX + this.getThumbnailWidth() &&
                iOffsetY >= iImageY && iOffsetY <= iImageY + this.getThumbnailHeight()) {
                return i;
            }
        }
        
        return false;
    },

    /**
     * Call back function to invoke the selection event
     * 
     * @param {Object} e
     */
    onCanvasClick : function(e) {
        if (!e) var e = window.event;
        
        // Calculate image ID
        if (typeof this.caller != "undefined") {
        	 var iImageID = this.caller.getImageCanvasIdbyOffset(e.offsetX, e.offsetY);
             
        	 // Be aware to set !== not != not to miss index 0
        	 if (iImageID !== false) {
        		 this.caller.updateEventInformationContent(iImageID);
        	 }
        }
    },

    /**
     * Track mouse move event
     */
    onCanvasMove : function(e) {
        if (!e) var e = window.event;
        
        // Calculate image ID
        if (typeof this.caller != "undefined") {
        	var iImageID = this.caller.getImageCanvasIdbyOffset(e.offsetX, e.offsetY);
        	if (iImageID !== false) {
        		this.caller.onCanvasSelectImage(iImageID);
        	}
        }
    },

    /**
     * Mark selected image
     */
    onCanvasSelectImage : function(iImageID) {
        if (iImageID < 0 || iImageID >= this.getImages().length) return;
        
        var oImage = this.getImages()[iImageID];
        if (!oImage) return;
        
        var iX;
        var iY;
            
        if (this.getSelectedImageId() !== false) {
            var oPrevSelectedImage = this.getImages()[this.getSelectedImageId()];
            var iX = oPrevSelectedImage.contextx;
            var iY = oPrevSelectedImage.contexty;
            
            this.getImageContext().lineWidth=3;
            this.getImageContext().strokeStyle="black";
            this.getImageContext().strokeRect(
        		iX-1, 
        		iY-1, 
        		this.getThumbnailWidth()+2, 
        		this.getThumbnailHeight()+2
    		);
        }
        
        this.setSelectedImageId(iImageID);
        
        if (typeof oImage.contextx != "undefined") {
            iX = oImage.contextx;
        }
        else return;
        
        if (typeof oImage.contexty != "undefined") {
            iY = oImage.contexty;
        }
        else return;
        
        this.getImageContext().lineWidth=3;
        this.getImageContext().strokeStyle="cyan"; 
        this.getImageContext().strokeRect(
    		iX-1, 
    		iY-1, 
    		this.getThumbnailWidth()+2, 
    		this.getThumbnailHeight()+2
		);
    },

    /**
     * Calculate image positions and size
     * 
     * @param {Number} iThumbnailWidth
     */
    calculateImagePosition : function(iThumbnailWidth) {
        
        // Update the tweets in timeline
        this.setImageCanvas(document.getElementById(this.getDivId())); 
        this.setImageContext(this.getImageCanvas().getContext("2d")); 
        
        this.getImageCanvas().width = this.element.getWidth();
        this.getImageCanvas().height = this.element.getHeight();

        this.setThumbnailWidth(
    		parseInt((this.getImageCanvas().width - (this.getThumbnailRowCount()+1)*5)/this.getThumbnailRowCount())
		);
        this.setThumbnailHeight(
    		parseInt(this.getThumbnailWidth() * this.getDefaultImageHeight() / this.getDefaultImageWidth())
		);
        
        // Assign canvas event handler
        this.getImageCanvas().caller = this;
        this.getImageCanvas().onclick = this.onCanvasClick;
        this.getImageCanvas().onmousemove = this.onCanvasMove;
            
        // Calculate width
        var iColumnCount = 0;
        var iRowCount = 0;
        var iMaxColumnItem = this.getThumbnailRowCount();
        if (iMaxColumnItem < 1) iMaxColumnItem = 1;
            
        for (var i = 0; i < this.getImages().length; ++i) {        
            var oImage = this.getImages()[i];
            
            oImage.width = this.getThumbnailWidth();
            oImage.height = this.getThumbnailHeight();
            oImage.contextx = (this.getThumbnailWidth()+5)*iColumnCount+5;
            oImage.contexty = (this.getThumbnailHeight()+5)*iRowCount+5;
            
            ++iColumnCount;
            if (iColumnCount >= iMaxColumnItem) {
                iColumnCount = 0;
                ++iRowCount;
            }
        }
        
        // Adjust canvas height
        this.getImageCanvas().height = (this.getThumbnailHeight()+5)*(iRowCount+1)+5;
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
                // oImage.timestamp = data[i].lastRecordingTime;
                // oImage.unixtimestamp = data[i].utcTimestamp;
                
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

            this.calculateImagePosition(this.getThumbnailWidth());
                            
            // Draw image objects
            var oControl = this;
            for (var i = 0; i < this.getImages().length; ++i) {
                oImage = this.getImages()[i];
                
                oImage.onload = function() {
                    // Draw image
                	oControl.getImageContext().drawImage(
                		this,
                		parseInt(this.contextx), 
                        parseInt(this.contexty),
                        oControl.getThumbnailWidth(),
                        oControl.getThumbnailHeight()
                    );
                };
            }
        }
    },


    /**
     * Resize the thumbnail by the number of image and canvas size
     */
    resizeThumbnail : function(slider, thumb, newValue) {
        if (oImageCanvas) {   
            this.setThumbnailWidth(parseInt(newValue*this.getDefaultImageWidth()/100));  
            this.calculateImagePosition(this.getThumbnailWidth());
            
            // To-do list.
            // To speed up, only render images shown on the screen
            // Calculate the display portion
            for (var i = 0; i < this.getImages().length; ++i) {
                this.getImageContext().drawImage(
            		this.getImages()[i], 
                    parseInt(this.getImages()[i].contextx), 
                    parseInt(this.getImages()[i].contexty),
                    this.getThumbnailWidth(),
                    this.getThumbnailHeight()
                );
            }
        }
    },

    setTemperature : function(iTemperature) {
        this.setImageInformationTemperature(document.getElementById("idImageInformationTemperature")); 
        this.getImageInformationTemperature().value = parseInt(iTemperature);
    },

    onGetGPSInformationbyTime : function(data) {
        if (data && data.root && !!data.root.length) {
            data = data.root[0];
            
            Ext.getCmp('idImageInformationTimestampedMap').show();
            var oLatLng = new google.maps.LatLng(data.latitude, data.longitude);
            
            // Ext.getCmp('idImageInformationTimestampedMap').map.setZoom(15);
            
            if (this.getImageMapCenterMarker() != null) {
                // Move marker
                this.getImageMapCenterMarker().setPosition(oLatLng);
            }
            else {
                // Create marker
                this.setImageMapCenterMarker(new google.maps.Marker({
                    map: Ext.getCmp('idImageInformationTimestampedMap').map, 
                    position: this.getLatLng()
                }));
            }
            this.getImageMapCenterMarker().setTitle(data.gps_UTC_timestamp);
            
            // Set icon by the status
            this.getImageMapCenterMarker().setIcon("./resources/images/walk_face_180.png");
            
            if (this.getImageInformation() == null) {
                this.setImageInformation(new google.maps.InfoWindow({
                    content: '<div id="idImageInformationDescription"></div><canvas id="idImageDescriptionCanvas" width="300px"></canvas>',
                    position: oLatLng,
                    width: 320,
                    height: 300
                }));
                
                // On Dom Ready
                var oController = this;
                google.maps.event.addListener(this.getImageInformation(), 'domready', function () {
                    // Fill up the descrition
                	oController.setImageInformationDescription(
            			document.getElementById("idImageInformationDescription")
            		);
                     if (oController.getImageInformationDescription() != null) {
                    	 oController.getImageInformationDescription().innerText = "Image: "
                            +oController.getImages()[oController.getCurrentImageId()].timestamp
                            +" GPS: "+data.gps_timestamp
                            +", "+data.latitude+", "
                            +data.longitude+" Direction: "
                            +data.direction+" at "
                            +data.mag_UTC_timestamp;
                    } 
                    
                    oController.setImageInformationCanvas(
                		 document.getElementById("idImageDescriptionCanvas")
                	); 
                    if (oController.getImageInformationCanvas() != null) {
                    	oController.setImageInformationContext(
                			oController.getImageInformationCanvas().getContext("2d")
                		); 
                        
                        // Draw image
                    	oController.getImageInformationContext().drawImage(
                			oController.getImages()[oController.getCurrentImageId()], 
                            0, 
                            0,
                            300,
                            parseInt(300 * oController.getDefaultImageHeight()/oController.getDefaultImageWidth())
                        );
                    }
                });
                
                this.getImageInformation().open(
                    Ext.getCmp('idImageInformationTimestampedMap').map, 
                    this.getImageMapCenterMarker()
                );
            }
            
            Ext.getCmp('idImageInformationTimestampedMap').map.setCenter(oLatLng);
            
            // Fill up the descrition
            this.setImageInformationDescription(
        		document.getElementById("idImageInformationDescription")
            );
            
            if (this.getImageInformationDescription() != null) {
                this.getImageInformationDescription().innerText = 
                "Image: "+this.getImages()[this.getCurrentImageId()].timestamp
                +" GPS: "+data.gps_timestamp+", "+data.latitude+", "+data.longitude
                +" Direction: "+data.direction+" at "+data.mag_UTC_timestamp;
            } 
            
            this.setImageInformationCanvas(
        		document.getElementById("idImageDescriptionCanvas")
        	); 
            if (this.getImageInformationCanvas() != null) {
                this.setImageInformationContext(
            		this.getImageInformationCanvas().getContext("2d")
        		); 
                
                // Draw image
                this.getImageInformationContext().drawImage(
                    this.getImages()[this.getCurrentImageId()], 
                    0, 
                    0,
                    300,
                    parseInt(300 * this.getDefaultImageHeight()/this.getDefaultImageWidth())
                );
            }
            
            this.setTemperature(data.temperature);
                            
        }
        else {
            // Ext.getCmp('idImageInformationTimestampedMap').hide();
            // Ext.getCmp('idImageInformationMapAddress').update('No GPS');
        }
    },

    updateEventInformationContent : function(iImageId) {
        if (iImageId < 0) return false;
        if (this.getImages().length <= 0) return false;
        if (iImageId >= this.getImages().length) return false;

        this.setCurrentImageId(iImageId);
        
        this.onCanvasSelectImage(iImageId);
        
        return true;
        
        // check the ID value
        // TODO: This part should be modified to work with information window.
        if (this.getCurrentImageId() == 0) {
            Ext.getCmp('idImageViewBack').disable();
        }
        else if (this.getCurrentImageId() > 0) {
            Ext.getCmp('idImageViewBack').enable();
        }
        
        if (this.getCurrentImageId() == this.getImages().length - 1) {
            Ext.getCmp('idImageViewForward').disable();
        }
        else if (this.getCurrentImageId() < this.getImages().length - 1) {
            Ext.getCmp('idImageViewForward').enable();
        }
        
        var oImage = this.getImages()[this.getCurrentImageId()];
        
        // Control canvas
        // Ext.getCmp('elog_image_information_panel_content').update('<img src="'+oImage.src+'" width="320px">');
        
        // Update the title
        // Ext.getCmp('elog_image_information_panel_title').setTitle(oImage.timestamp);
        
        // Update card information
        var oController = this;
        $.ajax({
            url: oServerSetting['server_index'],
            dataType: 'jsonp',
            data: {
                user_key: getCookie('api_key'),
                elog_command: 'GetLocationbyTime',
                timefrom: oImage.timestamp
            },
            success: function(data) {
            	oController.onGetGPSInformationbyTime(data);
            }
        });
    },
        
    highlightMouseOver : function(iImageID) {
        if (iImageID < 0) return false;
        if (iImageID >= this.getImages().length) return false;
        
        this.setCurrentImageId(iImageID);
        
        this.onCanvasSelectImage(iImageID);
    },

    showNextSlide : function() {
        var iImageID = this.getCurrentImageId() + 1;
        
        if (iImageID >= this.getImages().length) {
            this.clearInterval(oSlideInterval);
            Ext.getCmp("idImageViewSlideShow").setText('Slideshow');
        }
        
        this.updateEventInformationContent(iImageID);
    }
});
