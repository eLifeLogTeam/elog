/**
 * Image thumbnail viewer over the timeline.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.canvas.image.ThumbnailSlider', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.canvas.image.ThumbnailSlider', {
	extend: 'Elog.view.ui.panel.div.canvas.image.Thumbnail',
    xtype: 'elogImageThumbnailSlider',
    requires: [
       'Elog.view.ui.Mixin',
    ],
    mixins: ['Elog.view.ui.Mixin'],
    config : {
        /**
         * The count of image to display in one row
         */
        thumbnailRowCount : 1,
        /**
         * Thumbnail slide scroll direction: 'horizontal' or 'vertical'
         * @type String
         */
        direction: 'horizontal',
        
        thumbnailWidth: "128", // in pixel
    },
	
    init: function() {
    	this.callParent();
    	
    	this.getTimeRangeFromCookie();
    	
    	if (this.element.getHeight() !== null) {
    		this.setThumbnailHeight(
	    		parseInt((this.element.getHeight() - this.getDisplayOffset()*2)/this.getThumbnailRowCount())
			);
    	}
    	
    	// Rightnow calculate thumbnailHeight from the div element and let width follow the original image aspect ratio
        this.setThumbnailWidth(
	    	parseInt(this.getThumbnailWidth() * this.getDefaultImageWidth() / this.getDefaultImageWidth())
		);
    },

    /**
     * Retrieve image ID from the touch/mouse location
     * 
     * @param {Number} iOffsetX
     * @param {Number} iOffsetY
	 * @return {Number|Boolean} Returns the image ID or false when not found.
     */
    getCanvasIdbyOffset : function(iOffsetX, iOffsetY) {
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
     * Track mouse move event
     * 
     * TODO: Later use this event to refresh the image to show the full resolution image
     */
    onCanvasMove : function(e) {
        var iImageID = this.getCanvasIdbyOffset(e.offsetX, e.offsetY);
        
        // Be aware to set !== not != not to miss index 0
    	if (iImageID !== false) {
    		this.onCanvasSelectImage(iImageID);
    	}
    	
    	var oCanvasImage = this.getImages()[this.getSelectedImageId()];
		this.fireElogEvent({
			eventName: 'timechange', 
			eventConfig: {
				unixTimestamp: oCanvasImage.unixtimestamp,
				caller: this,
			}
		});
    },

    /**
     * Mark selected image
     * 
     * TODO: Bugs in selecting (0,0) and last row images
     */
    onCanvasSelectImage : function(iImageID) {
        if (iImageID < 0 || iImageID >= this.getImages().length) return;
        
        var oImage = this.getImages()[iImageID];
        if (!oImage) return;
        
        
        // Load full size image
        if (oImage.src.match(/width\%22:[0-9]+,/gi)) {
			// Update URL to load the full size image
			oImage.src =  oImage.src.replace(/width\%22:[0-9]+,/gi, "width\":null,");
		}
		else if (oImage.src.match(/width%22:%22[0-9]+%22,/gi)) {
			oImage.src =  oImage.src.replace(/width%22:%22[0-9]+%22,/gi, "width%22:null,");
		}
		
        var iX;
        var iY;
            
        if (this.getSelectedImageId() !== false) {
            var oPrevSelectedImage = this.getImages()[this.getSelectedImageId()];
            var iX = oPrevSelectedImage.contextx;
            var iY = oPrevSelectedImage.contexty;
            
            this.getCanvasContext().lineWidth=3;
            this.getCanvasContext().strokeStyle="black";
            this.getCanvasContext().strokeRect(
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
        
        this.getCanvasContext().lineWidth=3;
        this.getCanvasContext().strokeStyle="cyan"; 
        this.getCanvasContext().strokeRect(
    		iX-1, 
    		iY-1, 
    		this.getThumbnailWidth()+2, 
    		this.getThumbnailHeight()+2
		);
        
        // Fire event
        this.fireEvent('selectimage', iImageID);
        
        /*
		var oCanvasImage = this.getImages()[this.getSelectedImageId()];
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
     * Calculate image positions and size
     * 
     * @param {Number} iThumbnailWidth
     */
    calculateImagePosition : function(iThumbnailWidth) {
        if (this.getCanvas() == null) {
            this.setCanvas(document.getElementById(this.getDivId())); 
            this.setCanvasContext(this.getCanvas().getContext("2d")); 
    	}
        
        this.getCanvas().width = this.element.getWidth();
        this.getCanvas().height = this.element.getHeight();

        this.setThumbnailHeight(
    		parseInt((this.getCanvas().Height - (this.getThumbnailRowCount()+1)*5)/this.getThumbnailRowCount())
		);
        this.setThumbnailWidth(
    		parseInt(this.getThumbnailWidth() * this.getDefaultImageWidth() / this.getDefaultImageWidth())
		);
        
        // Assign canvas event handler
        this.getCanvas().caller = this;
        this.getCanvas().onmousemove = function(e) {
	        if (!e) var e = window.event;
	        
	        if (typeof this.caller != "undefined") {
	        	this.caller.onCanvasMove(e);
	        }
	    };
            
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
        this.getCanvas().height = (this.getThumbnailHeight()+5)*(iRowCount+1)+5;
        
	    // Calculate the background area
	    var oLastImage = this.getImages()[this.getImages().length - 1];
	    this.setBackX(oLastImage.contextx + oLastImage.width);
	    this.setBackY(oLastImage.contexty);
	    this.setBackWidth(this.getCanvas().width - this.getBackX());
	    this.setBackHeight(this.getCanvas().height - this.getBackY());
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
	    			oViewer.onCanvasSelectImage(i);
				}
			});    
			
			if (oStartItem == null) {
				oViewer.onCanvasSelectImage(oViewer.getImages().length-1);
			}
        }
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
    onSelectTimeRange : function(oTimeFrom, oTimeTo) {
        var oViewer = this;
        var oStartDate = new Date(oTimeFrom);
        var oEndDate = new Date(oTimeTo);
        // var oStartUnixtimestamp = oStartDate.getTime()/1000;
        // var oEndUnixtimestamp = oEndDate.getTime()/1000;
        var oStartUnixtimestamp = oTimeFrom.getTime()/1000;
        var oEndUnixtimestamp = oTimeTo.getTime()/1000;
            
        oViewer.redrawBackground();
            
        // Calculate width
        var iColumnCount = 0;
        var iRowCount = 0;
        var iMaxColumnItem = this.getThumbnailRowCount();
        if (iMaxColumnItem < 1) iMaxColumnItem = 1;
        var oLastImage = null;
        
        this.getImages().forEach(function(oImage) {  
        	if (oImage.unixtimestamp >= oStartUnixtimestamp &&  
        		oImage.unixtimestamp <= oEndUnixtimestamp) {
        		oImage.width = oViewer.getThumbnailWidth();
	            oImage.height = oViewer.getThumbnailHeight();
	            oImage.contextx = (oViewer.getThumbnailWidth()+5)*iColumnCount+5;
	            oImage.contexty = (oViewer.getThumbnailHeight()+5)*iRowCount+5;
	            
	            ++iColumnCount;
	            if (iColumnCount >= iMaxColumnItem) {
	                iColumnCount = 0;
	                ++iRowCount;
	            }
	            
	            oLastImage = oImage;
    		}
        });
        
        // Adjust canvas height
        this.getCanvas().height = (this.getThumbnailHeight()+5)*(iRowCount+1)+5;
        
	    // Calculate the background area
	    this.setBackX(oLastImage.contextx + oLastImage.width);
	    this.setBackY(oLastImage.contexty);
	    this.setBackWidth(this.getCanvas().width - this.getBackX());
	    this.setBackHeight(this.getCanvas().height - this.getBackY());
	    
	    this.getImages().forEach(function(oImage) {
	    	if (oImage.unixtimestamp >= oStartUnixtimestamp &&  
        		oImage.unixtimestamp <= oEndUnixtimestamp) {
		        oViewer.getCanvasContext().drawImage(
	        		oImage, 
	                parseInt(oImage.contextx), 
	                parseInt(oImage.contexty),
	                oViewer.getThumbnailWidth(),
	                oViewer.getThumbnailHeight()
	            );
    		}
	    });
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
            var oStartUnixtimestamp = null;
            var oEndUnixtimestamp = null;
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
				
				if (oStartUnixtimestamp == null) oStartUnixtimestamp = oImage.unixtimestamp;
            }
            
            if (oEndUnixtimestamp == null) oEndUnixtimestamp = oImage.unixtimestamp;

            // this.calculateImagePosition(this.getThumbnailWidth());
                            
            // Draw image objects
            // Here we set the limit on the start and end timestamp from the data
            var oControl = this;
            
            // oControl.redrawBackground();
            
            // for (var i = 0; i < this.getImages().length; ++i) {
            for (var i = 0; i < data.length; ++i) {
                oImage = this.getImages()[i];
                
                oImage.onload = function() {
                    // Draw image
                	/**
                	 * TODO: Here is the place to adjust width/height ratio for thumbnail display
                	 */
                	
                	if (typeof this.contextx === "undefined") {
                		oControl.setDefaultImageHeight(this.naturalHeight);
                		oControl.setDefaultImageWidth(this.naturalWidth);
                		
                		if (oControl.getDirection() == 'horizontal') {
                			// Equalize the image height
                			oControl.setThumbnailWidth(
					    		parseInt((oControl.getCanvas().width - (oControl.getThumbnailRowCount()+1)*5) / oControl.getThumbnailRowCount())
							);
					        oControl.setThumbnailHeight(
					    		parseInt(oControl.getThumbnailWidth() * oControl.getDefaultImageHeight() / oControl.getDefaultImageWidth())
							);
                		}
                		else {
                			// Equalize the image width
                			oControl.setThumbnailWidth(
				    			parseInt((oControl.getCanvas().width - (oControl.getThumbnailRowCount()+1)*5) / oControl.getThumbnailRowCount())
							);
					        oControl.setThumbnailHeight(
					    		parseInt(oControl.getThumbnailWidth() * oControl.getDefaultImageHeight() / oControl.getDefaultImageWidth())
							);
                		}
						
                		oControl.calculateImagePosition(oControl.getThumbnailWidth());
                	}
                	
                	oControl.getCanvasContext().drawImage(
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
                this.getCanvasContext().drawImage(
            		this.getImages()[i], 
                    parseInt(this.getImages()[i].contextx), 
                    parseInt(this.getImages()[i].contexty),
                    this.getThumbnailWidth(),
                    this.getThumbnailHeight()
                );
            }
        }
    },

	/**
	 * Redraw image list
	 */
	redrawImage : function(iImageId) {
	    if (iImageId < 0 || iImageId >= this.getImages().length) return;
	    
	    var oImage = this.getImages()[iImageId];
	    if (!oImage) return;
	    
	    // Remove background
	    this.getCanvasContext().fillRect(
    		oImage.contextx-5, 
    		oImage.contexty-5, 
	        this.getThumbnailWidth()+10, 
	        this.getThumbnailHeight()+10
	    );

	    // Draw image
	    this.getCanvasContext().drawImage(
    		oImage, 
    		oImage.contextx, 
    		oImage.contexty, 
	        this.getThumbnailWidth(), 
	        this.getThumbnailHeight()
	    );
	},
    
	/**
	 * Redraw the background
	 */
	redrawBackground : function() {
		var oImageViewer = this;
	    this.getOcclucedImages().forEach(function(oOccludedImageId, i) {
	        oImageViewer.redrawImage(oOccludedImageId);
	    });
	    
	    // Clear variables
	    this.getOcclucedImages().splice(0, this.getOcclucedImages().length);
	    
	    // Redraw the blank within thumbnail region
	    this.getCanvasContext().fillRect(
	        this.getBackX(),
	        this.getBackY(), 
	        this.getBackWidth(), 
	        this.getBackHeight()
	    );
	    
	    // Redraw outer thumbnail area
	    var iX1 = this.getThumbnailRowCount() * (this.getThumbnailWidth()+5);
	    var iWidth = this.getCanvas().width - iX1;
	    var iY1 = (this.getRowCount() + 1) * (this.getThumbnailHeight()+5);
	    var iHeight = (this.getCanvas().height - iX1 > 0) ? 
	                    this.getCanvas().height - iX1 :
	                    0;
	    
	    this.getCanvasContext().fillRect(
	        iX1,
	        0, 
	        iWidth, 
	        this.getCanvas().height
	    );
	    
	    this.getCanvasContext().fillRect(
	        0, 
	        iY1,
	        this.getCanvas().width, 
	        this.getCanvas().height - iHeight
	    );
	},
});
